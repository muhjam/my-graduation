'use client';

import { useState, useEffect, useCallback } from 'react';
import { Camera, Plus, Upload, X, LogIn, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import FileUpload from './FileUpload';

interface Photo {
  id: string;
  from: string;
  image: string;
  caption: string;
  createdAt: string;
}

interface PhotoAlbumProps {
  photos: Photo[];
  onUploadPhoto?: (file: File, caption: string) => void;
  isLoadingPhotos?: boolean;
}

export default function PhotoAlbum({ 
  photos, 
  onUploadPhoto, 
  isLoadingPhotos = false
}: PhotoAlbumProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);

  // Check if user just logged in and modal should be open
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('modal') === 'open') {
      setShowUploadModal(true);
      // Remove the parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Create preview when upload is successful
  useEffect(() => {
    if (uploadedFileUrl && selectedFile && !previewUrl) {
      const blobUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(blobUrl);
    }
  }, [uploadedFileUrl, selectedFile, previewUrl]);

  // Memoized upload success handler
  const handleUploadSuccess = useCallback((fileUrl: string, fileName: string) => {
    setUploadedFileUrl(fileUrl);
    // Force re-render after state update
    setTimeout(() => {
      if (selectedFile && !previewUrl) {
        const blobUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(blobUrl);
      }
    }, 100);
  }, [selectedFile, previewUrl]);

  // Listen for messages from OAuth popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        // Auth success, popup will close automatically
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Listen for URL changes (when auth=success is in URL)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      // Remove the auth parameter from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('auth');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, []);

  return (
    <section className="py-20 px-6 bg-cream-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-brown-100 p-4 rounded-full">
              <Camera className="w-8 h-8 text-brown-600" />
            </div>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Album Foto
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share momen perjalanan kuliah atau wisuda bareng aku di sini, yuk!
          </p>
        </div>

        {/* Upload Button */}
        <div className="text-center mb-8">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-cream-600 hover:bg-cream-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Kenangan</span>
            </button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoadingPhotos ? (
            // Loading skeleton for photos
            <>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`relative transform shadow-lg ${
                  Math.floor(i / 4) % 2 === 0 ? 'rotate-3' : '-rotate-3'
                }`}>
                  <div className="aspect-square bg-gray-200 w-full h-48 rounded-lg"></div>
                </div>
              ))}
            </>
          ) : photos.length > 0 ? (
            photos
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((photo, index) => (
                <div
                 key={photo.id}
                 className={`relative transform shadow-lg rounded-lg bg-white h-fit ${
                   Math.floor(index / 4) % 2 === 0 ? 'rotate-3' : '-rotate-3'
                 }`}>
                <div className="p-2 rounded-lg">
                  <div 
                    className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setSelectedImage(photo);
                      setShowImageModal(true);
                    }}
                  >
                  <Image
                    src={photo.image}
                    alt={photo.caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-gray-800 font-medium text-sm text-center mt-2">{photo.caption}</p>
                </div>
                <div className="absolute -top-2 -left-6 mx-4 p-2 bg-brown-600 rounded-full">
                        <GraduationCap className="w-4 h-4 text-white" />
                    </div>
              </div>
            ))
          ) : (
            // Empty state when no photos
            <div className="col-span-full text-center py-12">
              <div className="bg-brown-100 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-10 h-10 text-brown-600" />
              </div>
              <h3 className="font-playfair text-xl font-semibold text-gray-800 mb-2">
                Belum Ada Foto
              </h3>
              <p className="text-gray-600">
                Jadilah yang pertama mengunggah foto untuk album ini
              </p>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-playfair text-xl font-semibold">Upload Foto</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Foto
                  </label>
                  <FileUpload
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={(error) => {
                      console.error('Upload error:', error);
                      // You can show error message to user here
                    }}
                    disabled={isUploading}
                    caption={caption}
                    onFileSelect={(file) => {
                      setSelectedFile(file);
                      // Don't create preview yet, wait for upload success
                    }}
                    selectedFile={selectedFile}
                    uploadedFileUrl={uploadedFileUrl}
                    previewUrl={previewUrl}
                    isUploading={isUploading}
                    onRemoveFile={() => {
                      setSelectedFile(null);
                      setUploadedFileUrl(null);
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Tulis caption untuk foto..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-transparent resize-none"
                    rows={3}
                    maxLength={100}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {caption.length}/100
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setCaption('');
                      setSelectedFile(null);
                      setUploadedFileUrl(null);
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={async () => {
                      if (!uploadedFileUrl) {
                        alert('Upload foto terlebih dahulu');
                        return;
                      }
                      setIsUploading(true);
                      try {
                        // Submit URL + caption to database
                        const response = await fetch('/api/photos', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            image: uploadedFileUrl,
                            caption: caption,
                            from: 'User' // You can get this from user context
                          }),
                        });

                        if (response.ok) {
                          // Success - close modal and refresh
                          setShowUploadModal(false);
                          setCaption('');
                          setSelectedFile(null);
                          setUploadedFileUrl(null);
                          if (previewUrl) {
                            URL.revokeObjectURL(previewUrl);
                            setPreviewUrl(null);
                          }
                          // Refresh photos list
                          window.location.reload();
                        } else {
                          throw new Error('Failed to save photo');
                        }
                      } catch (error) {
                        console.error('Submit error:', error);
                        alert('Gagal menyimpan foto. Silakan coba lagi.');
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                    disabled={!uploadedFileUrl || isUploading}
                    className="flex-1 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? 'Menyimpan...' : 'Kirim'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close button */}
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedImage(null);
                }}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Image container */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={selectedImage.image}
                    alt={selectedImage.caption}
                    fill
                    className="object-contain rounded-lg"
                    priority
                  />
                </div>
              </div>
              
              {/* Image info overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{selectedImage.caption}</h3>
                <p className="text-sm text-gray-300">
                  {new Date(selectedImage.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
