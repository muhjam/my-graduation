'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// Remove direct Google Auth import, we'll use API routes instead

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received.');
        return;
      }

      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const result = await response.json();
        
        if (result.success) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Store user info and tokens in localStorage
          localStorage.setItem('googleUser', JSON.stringify({
            ...result.user,
            accessToken: result.tokens.access_token
          }));
          
          // Redirect back to main page
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Failed to authenticate user.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during authentication.');
        console.error('Auth error:', error);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 card-shadow text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-cream-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="font-playfair text-2xl font-semibold text-gray-800 mb-2">
              Authenticating...
            </h2>
            <p className="text-gray-600">Please wait while we authenticate your Google account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-playfair text-2xl font-semibold text-gray-800 mb-2">
              Success!
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="font-playfair text-2xl font-semibold text-gray-800 mb-2">
              Error
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-cream-600 hover:bg-cream-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cream-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memproses autentikasi...</p>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
