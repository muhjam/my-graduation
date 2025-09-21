'use client';

import { useState, useRef, useEffect } from 'react';
import { initiateGoogleAuth } from '@/lib/googleAuth';

interface FileUploadProps {
  onUploadSuccess: (fileUrl: string, fileName: string) => void;
  onUploadError: (error: string) => void;
  disabled?: boolean;
  caption?: string;
  onFileSelect?: (file: File) => void;
  selectedFile?: File | null;
  uploadedFileUrl?: string | null;
  previewUrl?: string | null;
  onRemoveFile?: () => void;
  isUploading?: boolean;
}

export default function FileUpload({ onUploadSuccess, onUploadError, disabled = false, caption = '', onFileSelect, selectedFile, uploadedFileUrl, previewUrl, onRemoveFile, isUploading = false }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const getRedirectUrl = () => {
    return process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL || 'http://localhost:3000/auth/google/callback';
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatusLocal();
  }, []);

  const checkAuthStatusLocal = async () => {
    try {
      const response = await fetch('/api/auth/google/status');
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setIsLoading(true);
      
      const redirectUrl = getRedirectUrl();
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
        `scope=${encodeURIComponent('https://www.googleapis.com/auth/drive.file')}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`;


      const popup = window.open(
        authUrl,
        'googleAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Check for popup closure or completion (like vercel project)
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Check if authentication was successful
          checkAuthStatusLocal();
        }
      }, 1000);

      // Listen for message from popup (like vercel project)
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageListener);
          // Check auth status after successful login
          setTimeout(() => {
            checkAuthStatusLocal();
          }, 500);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageListener);
          onUploadError(event.data.error || 'Authentication failed');
        }
      };
      
      window.addEventListener('message', messageListener);
      
      // Remove listener after a timeout to prevent memory leaks
      setTimeout(() => {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
      }, 30000);
      
    } catch (error) {
      console.error('Auth error:', error);
      onUploadError(error instanceof Error ? error.message : 'Failed to connect to Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      setIsLoading(true);
      
      // Clear cookies via API
      await fetch('/api/auth/google/logout', {
        method: 'POST',
      });
      
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error disconnecting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      setIsLoading(true);
      
      // First disconnect current account
      await handleDisconnectGoogle();
      
      // Then connect new account
      await handleConnectGoogle();
    } catch (error) {
      console.error('Error switching account:', error);
      onUploadError('Failed to switch account');
    } finally {
      setIsLoading(false);
    }
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload an image file (JPEG, PNG, GIF, or WebP)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFileSelect = async (file: File) => {
    // Clear any previous error messages
    setErrorMessage(null);
    
    // Check if user is authenticated before selecting file
    if (!isAuthenticated) {
      const error = 'Please connect your Google account first to upload files.';
      setErrorMessage(error);
      onUploadError(error);
      return;
    }

    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      onUploadError(error);
      return;
    }

    // Select the file first
    if (onFileSelect) {
      onFileSelect(file);
    }

    // Then immediately upload the file
    await handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setErrorMessage(null); // Clear any previous errors
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (caption) {
        formData.append('caption', caption);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUploadSuccess(data.data.url, data.data.name);
      } else {
        const error = data.error || 'Upload failed';
        setErrorMessage(error);
        onUploadError(error);
      }
    } catch (err) {
      const error = 'Upload failed. Please try again.';
      setErrorMessage(error);
      onUploadError(error);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading && isAuthenticated) {
      fileInputRef.current?.click();
    }
  };

  // Expose upload function for external use
  const uploadSelectedFile = async () => {
    if (selectedFile) {
      await handleFileUpload(selectedFile);
    }
  };

  // Expose upload function via ref or callback
  useEffect(() => {
    if (onFileSelect) {
      // Store upload function in a way that parent can access it
      (window as any).uploadSelectedFile = uploadSelectedFile;
    }
  }, [selectedFile, caption]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="w-full">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Checking authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show OAuth connect button if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="w-full">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="space-y-4">
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-gray-600">
                <p className="font-medium">Connect Google Drive to upload files</p>
                <p className="text-sm">You need to authorize access to upload files</p>
              </div>
            </div>
            
            <button
              onClick={handleConnectGoogle}
              disabled={disabled || isLoading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span className="text-sm font-medium text-gray-700">
                {isLoading ? 'Connecting...' : 'Connect Google Drive'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show file upload interface if authenticated
  return (
    <div className="w-full">
      {/* Error Message Display */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800 text-sm font-medium">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {previewUrl && !isUploading ? (
        // Show image preview when file is uploaded successfully (using blob URL)
        <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="w-full h-48 object-cover"
            onError={(e) => {
              console.error('Image load error:', e);
            }}
            onLoad={() => {
              // Image loaded successfully
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onRemoveFile) {
                onRemoveFile();
              }
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="p-3 bg-gray-50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">
                {uploadedFileUrl ? 'File uploaded successfully!' : 'Connected to Google Drive'}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwitchAccount();
                }}
                disabled={isLoading}
                className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>{isLoading ? 'Switching...' : 'Switch Account'}</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDisconnectGoogle();
                }}
                disabled={isLoading}
                className="flex items-center space-x-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{isLoading ? 'Disconnecting...' : 'Disconnect'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Show upload interface when no file uploaded
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : errorMessage
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled || uploading || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled || uploading || isUploading}
          />
          
          <div className="space-y-2">
            {uploading || isUploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Connected to Google Drive</span>
                </div>
                
                {/* Account Management Buttons */}
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwitchAccount();
                    }}
                    disabled={isLoading}
                    className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>{isLoading ? 'Switching...' : 'Switch Account'}</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDisconnectGoogle();
                    }}
                    disabled={isLoading}
                    className="flex items-center space-x-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{isLoading ? 'Disconnecting...' : 'Disconnect'}</span>
                  </button>
                </div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-gray-600">
                  <p className="font-medium">
                    Click to select or drag and drop
                  </p>
                  <p className="text-sm">
                    PNG, JPG, GIF, WebP up to 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
