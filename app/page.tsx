'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import InvitationMessage from '@/components/InvitationMessage';
import PhotoAlbum from '@/components/PhotoAlbum';
import MessageSection from '@/components/MessageSection';
import { invitationData, samplePhotos, sampleMessages } from '@/data/mockData';
// Remove direct Google Script import, we'll use API routes instead

interface Photo {
  id: string;
  from: string;
  image: string;
  caption: string;
  createdAt: string;
}

interface Message {
  id: string;
  fullname: string;
  is_present: boolean;
  message: string;
  created_at: string;
  updated_at: string;
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get('kepada');
  
  const [photos, setPhotos] = useState<Photo[]>(samplePhotos);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Load photos from API
      try {
        const photosResponse = await fetch('/api/photos');
        if (photosResponse.ok) {
          const photosData = await photosResponse.json();
          if (photosData.success && photosData.data) {
            setPhotos(photosData.data);
          }
        }
      } catch (error) {
        console.error('Failed to load photos:', error);
      } finally {
        setIsLoadingPhotos(false);
      }

      // Load messages from API
      try {
        const messagesResponse = await fetch('/api/messages');
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          if (messagesData.success && messagesData.data) {
            setMessages(messagesData.data);
          }
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadData();
  }, []);

  const handleNewMessage = (newMessage: Message) => {
    setMessages(prev => [newMessage, ...prev]);
  };

  const handleUploadPhoto = async (file: File, caption: string) => {
    // This would integrate with Google Drive API
    // For now, we'll simulate the upload
    const newPhoto: Photo = {
      id: Date.now().toString(),
      image: URL.createObjectURL(file),
      caption,
      from: 'Guest',
      createdAt: new Date().toISOString()
    };
    
    setPhotos(prev => [newPhoto, ...prev]);
  };


  return (
    <main className="min-h-screen">
      <Header
        graduateName={invitationData.graduateName}
        degree={invitationData.degree}
        university={invitationData.university}
        graduationDate={invitationData.graduationDate}
        graduationTime={invitationData.graduationTime}
        venue={invitationData.venue}
        address={invitationData.address}
      />

      <InvitationMessage
        message={invitationData.message}
        familyName={invitationData.familyName}
        guestName={guestName || undefined}
      />

      <PhotoAlbum
        photos={photos}
        onUploadPhoto={handleUploadPhoto}
        isLoadingPhotos={isLoadingPhotos}
      />

      <MessageSection
        messages={messages}
        onNewMessage={handleNewMessage}
        isLoadingMessages={isLoadingMessages}
      />

      {/* Footer */}
      <footer className="bg-cream-100 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-1 bg-cream-400 rounded-full"></div>
          </div>
          <p className="font-playfair text-2xl font-semibold text-gray-800 mb-4">
            Terima Kasih
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Terima kasih banyak udah nyempetin hadir dan mendoakan yang terbaik, semoga kebersamaan ini makin seru dan penuh kebahagiaan buat kita semua!
          </p>
          
          {/* University Logo */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative w-12 h-12">
              <Image
                src="/images/logo-universitas.png"
                alt="Logo Universitas Pasundan"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {invitationData.university}
            </p>
          </div>
          
          <div className="text-sm text-center text-gray-500">
            <p>© 2025 <a href="https://instagram.com/muhamadjamaludinpad" target="_blank" rel="noopener noreferrer" className="text-blue-600 transition-colors duration-200 hover:underline decoration-2 underline-offset-2">{invitationData.familyName}</a></p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cream-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat undangan...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
