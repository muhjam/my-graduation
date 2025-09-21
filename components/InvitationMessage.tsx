'use client';

import { invitationData } from '@/data/mockData';
import { Calendar, Clock, MapPin, Shirt, Camera, Utensils } from 'lucide-react';
import Image from 'next/image';

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
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Informasi Acara
          </h2>
          <p className="text-lg text-gray-600">
            Detail lengkap untuk persiapan kehadiran Anda
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Dress Code Section */}
          <div className="bg-white rounded-2xl p-8 card-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-brown-100 p-3 rounded-full mr-4">
                <Shirt className="w-6 h-6 text-brown-600" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold text-gray-800">
                Dress Code
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl px-4">
                <h4 className="font-semibold text-gray-800 mb-2">Color Code:</h4>
                <div className='flex items-center gap-2'>
                <div className='relative group'>
                  <div className='w-10 h-10 bg-brown-200 rounded-md border cursor-pointer'></div>
                  <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                    Krem
                  </div>
                </div>
                <div className='relative group'>
                  <div className='w-10 h-10 bg-white rounded-md border cursor-pointer'></div>
                  <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                    Putih
                  </div>
                </div>
                <div className='relative group'>
                  <div className='w-10 h-10 bg-brown-600 rounded-md border cursor-pointer'></div>
                  <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                    Coklat
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* Dress Code Example Photos */}
            <div className="mt-6 px-4">
              <h4 className="font-semibold text-gray-800">Contoh Dress Code:</h4>
              <div className="grid grid-cols-2 gap-2 md:gap-4 items-center justify-center">
                <div className="bg-white rounded-lg p-2 text-center flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 md:w-48 md:h-48 rounded-lg overflow-hidden mb-2">
                  <Image
                    src="/images/dress-men.png"
                    alt="Dress Code Photo 1"
                    fill
                    className="object-cover"
                    priority
                  />
                  </div>
                  <p className="text-xs text-center text-gray-600">Laki-laki</p>
                </div>
                <div className="bg-white rounded-lg p-2 text-center flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 md:w-48 md:h-48 rounded-lg overflow-hidden mb-2">
                  <Image
                    src="/images/dress-women.png"
                    alt="Dress Code Photo 2"
                    fill
                    className="object-cover"
                    priority
                  />
                  </div>
                  <p className="text-xs text-center text-gray-600">Perempuan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rundown Acara Section */}
          <div className="bg-white rounded-2xl p-8 card-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-brown-100 p-3 rounded-full mr-4">
                <Calendar className="w-6 h-6 text-brown-600" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold text-gray-800">
                Rundown Acara
              </h3>
            </div>

            <div className="space-y-6">
              {/* Timeline Item */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brown-200 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-brown-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-800">13.00 - 15.00 WIB</h4>
                    <span className="bg-brown-200 text-brown-800 text-xs px-2 py-1 rounded-full">
                      Makan & Foto
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Acara makan-makan dan sesi foto bersama keluarga dan teman-teman
                  </p>
                </div>
              </div>
            </div>

            {/* Venue Info */}
            <div className="bg-white rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
              <div className="flex-shrink-0 w-12 h-12 bg-brown-200 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-brown-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Lokasi Acara</h4>
              </div>
              <p className="text-gray-600 mb-2">
                Wheels Coffee Roasters Juanda<br/>
                <a 
                  href={invitationData.address} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline text-sm"
                >
                  Lihat di Google Maps
                </a>
              </p>
              <div className="relative w-full h-40 rounded-lg overflow-hidden">
                  <Image
                    src="/images/location.jpg"
                    alt="Location Photo"
                    fill
                    className="object-cover"
                    priority
                  />
                  </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-4">
          <div className="w-2 h-2 bg-brown-300 rounded-full"></div>
          <div className="w-3 h-3 bg-brown-400 rounded-full"></div>
          <div className="w-2 h-2 bg-brown-300 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
