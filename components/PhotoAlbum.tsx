'use client';

import { useState, useEffect } from 'react';
import { Camera, Plus, Upload, X, LogIn, GraduationCap } from 'lucide-react';
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Removed 'from' state
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem('googleUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Check if user just logged in and modal should be open
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('modal') === 'open') {
      setShowUploadModal(true);
      // Restore caption from localStorage
      const savedCaption = localStorage.getItem('tempCaption');
      if (savedCaption) {
        setCaption(savedCaption);
        localStorage.removeItem('tempCaption');
      }
      // Remove the parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
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
            from: user?.name || 'Guest'
          }),
        });

        const photoResult = await photoResponse.json();

        if (photoResult.success) {
          setShowUploadModal(false);
          setSelectedFile(null);
          setCaption('');
          handleRemoveImage(); // Clear preview
          // Removed setFrom
          
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
            photos.map((photo, index) => (
                <div
                 key={photo.id}
                 className={`relative transform shadow-lg rounded-lg bg-white h-fit ${
                   Math.floor(index / 4) % 2 === 0 ? 'rotate-3' : '-rotate-3'
                 }`}>
                <div className="p-2 rounded-lg">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
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
                  {user ? (
                    previewUrl ? (
                      <div className="relative">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <input
                          id="fileInput"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => document.getElementById('fileInput')?.click()}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600 mb-2">Drag or click here</p>
                          <p className="text-sm text-gray-500">to upload your photo</p>
                        </div>
                        <input
                          id="fileInput"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    )
                  ) : (<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-2">Connect Google Drive to upload files</p>
                      <p className="text-sm text-gray-500 mb-4">You need to authorize access to upload files</p>
                       <button 
                         onClick={async () => {
                           try {
                             // Save current caption to localStorage
                             localStorage.setItem('tempCaption', caption);
                             const response = await fetch('/api/auth/google');
                             const result = await response.json();
                             if (result.success) {
                               // Add modal=open parameter to redirect URL
                               const authUrl = new URL(result.authUrl);
                               authUrl.searchParams.set('modal', 'open');
                               window.location.href = authUrl.toString();
                             }
                           } catch (error) {
                             console.error('Failed to get auth URL:', error);
                           }
                         }}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-2 mx-auto hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">G</span>
                        </div>
                        <span className="text-gray-700">Connect Google Drive</span>
                      </button>
                    </div>
                  </div>
                  )}
                </div>

                {/* Removed nama field */}

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
                    disabled={!selectedFile || !caption || isUploading}
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
