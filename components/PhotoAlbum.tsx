'use client';

import { useState, useEffect } from 'react';
import { Camera, Plus, Upload, X, LogIn } from 'lucide-react';
import Image from 'next/image';
// Remove direct Google Auth import, we'll use API routes instead

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
  isAuthenticated?: boolean;
  isLoadingPhotos?: boolean;
}

export default function PhotoAlbum({ 
  photos, 
  onUploadPhoto, 
  isAuthenticated = false,
  isLoadingPhotos = false
}: PhotoAlbumProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [from, setFrom] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem('googleUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      // First upload to Google Drive
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('caption', caption);
      formData.append('accessToken', user?.accessToken || '');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (uploadResult.success) {
        // Then save to Google Sheets via API
        const photoResponse = await fetch('/api/photos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: uploadResult.data.url,
            caption: caption,
            from: from || user?.name || 'Guest'
          }),
        });

        const photoResult = await photoResponse.json();

        if (photoResult.success) {
          setShowUploadModal(false);
          setSelectedFile(null);
          setCaption('');
          setFrom('');
          
          // Refresh photos list
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-cream-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-cream-100 p-4 rounded-full">
              <Camera className="w-8 h-8 text-cream-600" />
            </div>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Album Foto
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kumpulan momen berharga dalam perjalanan menuju kelulusan
          </p>
        </div>

        {/* Upload Button */}
        <div className="text-center mb-8">
          {user ? (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-cream-600 hover:bg-cream-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Foto</span>
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/auth/google');
                  const result = await response.json();
                  if (result.success) {
                    window.location.href = result.authUrl;
                  }
                } catch (error) {
                  console.error('Failed to get auth URL:', error);
                }
              }}
              className="bg-cream-600 hover:bg-cream-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <LogIn className="w-5 h-5" />
              <span>Login untuk Upload Foto</span>
            </button>
          )}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingPhotos ? (
            // Loading skeleton for photos
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden card-shadow animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </>
          ) : photos.length > 0 ? (
            photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-xl overflow-hidden card-shadow hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative aspect-square">
                  <Image
                    src={photo.image}
                    alt={photo.caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-800 font-medium mb-2">{photo.caption}</p>
                  <p className="text-sm text-gray-500">
                    Oleh: {photo.from}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(photo.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            // Empty state when no photos
            <div className="col-span-full text-center py-12">
              <div className="bg-cream-100 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-10 h-10 text-cream-600" />
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Anda
                  </label>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-transparent"
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
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || !from || !caption || isUploading}
                    className="flex-1 px-4 py-2 bg-cream-600 text-white rounded-lg hover:bg-cream-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
