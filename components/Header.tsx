'use client';

import { GraduationCap, Calendar, MapPin, Clock, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface HeaderProps {
  graduateName: string;
  degree: string;
  university: string;
  graduationDate: string;
  graduationTime: string;
  venue: string;
  address: string;
}

export default function Header({
  graduateName,
  degree,
  university,
  graduationDate,
  graduationTime,
  venue,
  address
}: HeaderProps) {
  const searchParams = useSearchParams();
  const guestName = searchParams.get('kepada') || 'Bapak/Ibu/Saudara/i';
  return (
    <header className="relative min-h-screen flex flex-col justify-center bg-gray-50 overflow-hidden py-10">
      {/* Cover Image Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/cover-header.jpeg"
          alt="University Cover"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
      
      {/* Subtle Leaf Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-brown-400">
            <path d="M50 10 C30 30, 70 30, 50 50 C30 70, 70 70, 50 90" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="absolute top-40 right-32 w-32 h-32 opacity-15">
          <svg viewBox="0 0 100 100" className="w-full h-full text-brown-400">
            <path d="M50 10 C30 30, 70 30, 50 50 C30 70, 70 70, 50 90" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-32 w-36 h-36 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-brown-400">
            <path d="M50 10 C30 30, 70 30, 50 50 C30 70, 70 70, 50 90" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-20 w-28 h-28 opacity-15">
          <svg viewBox="0 0 100 100" className="w-full h-full text-brown-400">
            <path d="M50 10 C30 30, 70 30, 50 50 C30 70, 70 70, 50 90" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        {/* Simple Logo at Top */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brown-300 to-transparent"></div>
          <div className="mx-4 p-2 bg-brown-100 rounded-full">
            <GraduationCap className="w-4 h-4 text-brown-600" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brown-300 to-transparent"></div>
        </div>


        {/* Main Title - Script Style */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-playfair text-3xl md:text-5xl lg:text-7xl font-bold text-gray-800 mb-6 md:mb-8" style={{fontFamily: 'cursive'}}>
            Undangan Wisuda!
          </h1>
        </div>

        {/* Graduate Photos - Polaroid Style */}
        <div className="mb-8 md:mb-12">
          <div className="flex justify-center items-center space-x-4 md:space-x-8">
            {/* Left Photo */}
            <div className="relative transform rotate-3 shadow-lg">
              <div className="bg-white p-2 md:p-4 rounded-lg">
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/images/wisuda-image-1.png"
                    alt="Graduation Photo 1"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Right Photo */}
            <div className="relative transform -rotate-3 shadow-lg">
              <div className="bg-white p-2 md:p-4 rounded-lg">
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/images/wisuda-image-2.png"
                    alt="Graduation Photo 2"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graduate Name - Script Style */}
        <div className="mb-4">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{fontFamily: 'cursive'}}>
            {graduateName}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {degree}
          </p>
          
          {/* Event Information - Minimalist */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Informasi Acara:</p>
            <p className="text-gray-700 font-medium">
              Sabtu, 8 November 2025 | 13.00 WIB <br/>📍<a href={address} target="_blank" rel="noopener noreferrer" className='text-blue-600 transition-colors duration-200 hover:underline decoration-2 underline-offset-2'>{venue}</a>
            </p>
          </div>
        </div>

        {/* Kepada Section */}
        <div className="mb-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Kepada:</p>
            <p className="text-lg text-gray-700 font-medium">
              {guestName}
            </p>
          </div>
        </div>

        {/* Congratulatory Message */}
        <div className="mb-4">
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Yuk, datang ke wisudaku!<br/>Bakal seru banget kalau kamu bisa hadir bareng aku.
          </p>
        </div>

      </div>

      {/* Simple Scroll Indicator - Fixed at Bottom */}
      <div className="relative z-10 flex justify-center pb-8">
        <div className="group cursor-pointer">
          <div className="w-8 h-8 bg-brown-200 rounded-full flex items-center justify-center group-hover:bg-brown-300 transition-all duration-300 animate-bounce">
            <ArrowDown className="w-4 h-4 text-brown-600 group-hover:translate-y-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </header>
  );
}
