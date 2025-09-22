'use client';

import { useState } from 'react';
import { MessageCircle, Send, Users, CheckCircle } from 'lucide-react';
// Remove direct Google Script import, we'll use API routes instead

interface Message {
  id: string;
  fullname: string;
  is_present: boolean;
  message: string;
  created_at: string;
  updated_at: string;
}

interface MessageSectionProps {
  messages: Message[];
  onNewMessage?: (message: Message) => void;
  isLoadingMessages?: boolean;
}

export default function MessageSection({ 
  messages, 
  onNewMessage,
  isLoadingMessages = false
}: MessageSectionProps) {
  const [formData, setFormData] = useState({
    fullname: '',
    is_present: true,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setFormData({
          fullname: '',
          is_present: true,
          message: ''
        });
        
        if (onNewMessage) {
          onNewMessage({
            id: Date.now().toString(),
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } else {
        console.error('Failed to submit RSVP:', result.error);
      }
    } catch (error) {
      console.error('Failed to submit RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <section className="py-20 px-4 md:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-brown-600 p-4 rounded-full">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Kata Kata
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tulis kata-kata hari ini dan kasih tahu bakal hadir atau nggak-nya ya!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* RSVP Form */}
          <div className="bg-white rounded-2xl p-8 card-shadow">
            <h3 className="font-playfair text-2xl font-semibold text-gray-800 mb-6">
              Konfirmasi Kehadiran
            </h3>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">Terima kasih! Konfirmasi Anda telah terkirim.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kamu *
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-transparent"
                  placeholder="Masukkan nama kamu"
                />
              </div>


              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kehadiran
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_present: true })}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors w-1/2 ${
                      formData.is_present
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                    }`}
                  >
                    Hadir Dong!
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_present: false })}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors w-1/2 ${
                      !formData.is_present
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                    }`}
                  >
                    Engga Dulu
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                  Kata Kata
                  <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.message.length}/350
                </div>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={350}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-transparent resize-none"
                  placeholder="Tulis kata-kata hari ini..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brown-600 hover:bg-brown-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Kirim Konfirmasi</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Messages List */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-brown-600" />
              <h3 className="font-playfair text-2xl font-semibold text-gray-800">
                Kata Kata Hari Ini ({messages.length})
              </h3>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {isLoadingMessages ? (
                <div className="space-y-4">
                  {/* Loading skeleton */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 card-shadow animate-pulse">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 mt-3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {messages
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((message) => (
                    <div
                      key={message.id}
                      className="bg-white rounded-xl p-6 card-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{message.fullname}</h4>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            message.is_present 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {message.is_present ? 'Hadir Dong!' : 'Engga Dulu'}
                          </div>
                        </div>
                      </div>
                      
                      {message.message && (
                        <p className="text-gray-700 leading-relaxed">{message.message}</p>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-3">
                        {new Date(message.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}

                  {messages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Belum ada kata-kata hari ini</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
