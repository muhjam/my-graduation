'use client';

import { Heart, Quote } from 'lucide-react';

interface InvitationMessageProps {
  message: string;
  familyName: string;
  guestName?: string;
}

export default function InvitationMessage({ 
  message, 
  familyName, 
  guestName 
}: InvitationMessageProps) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative Quote Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-cream-100 p-4 rounded-full">
            <Quote className="w-8 h-8 text-cream-600" />
          </div>
        </div>

        {/* Personalized Greeting */}
        {guestName && (
          <div className="mb-8">
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
              Kepada Yth. {guestName}
            </h2>
            <div className="flex justify-center">
              <Heart className="w-6 h-6 text-cream-500" />
            </div>
          </div>
        )}

        {/* Main Message */}
        <div className="bg-cream-50 rounded-2xl p-8 md:p-12 card-shadow">
          <p className="font-playfair text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="border-t border-cream-200 pt-6">
            <p className="text-cream-600 font-medium">
              Hormat kami,
            </p>
            <p className="font-playfair text-xl font-semibold text-gray-800 mt-2">
              {familyName}
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-4">
          <div className="w-2 h-2 bg-cream-300 rounded-full"></div>
          <div className="w-3 h-3 bg-cream-400 rounded-full"></div>
          <div className="w-2 h-2 bg-cream-300 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
