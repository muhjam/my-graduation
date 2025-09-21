'use client';

import { GraduationCap, Calendar, MapPin, Clock, ArrowDown } from 'lucide-react';
import Image from 'next/image';

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
  return (
    <header className="relative min-h-screen flex items-center justify-center cream-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-cream-400 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-cream-400 rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 border-2 border-cream-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-cream-400 rounded-full"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Decorative Elements */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-1 bg-cream-400 rounded-full"></div>
          <GraduationCap className="mx-4 w-8 h-8 text-cream-600" />
          <div className="w-16 h-1 bg-cream-400 rounded-full"></div>
        </div>

        {/* Main Title */}
        <h1 className="font-playfair text-5xl md:text-7xl font-bold gradient-text pb-6 line-height-[100px]">
          Undangan Wisuda
        </h1>

        {/* Graduate Info */}
        <div className="mb-8">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
            {graduateName}
          </h2>
          <p className="text-xl md:text-2xl text-cream-700 font-medium">
            {degree}
          </p>
          <div className="flex flex-col items-center justify-center space-x-4">
          <p className="text-lg text-cream-600 font-medium">
              {university}
            </p>
            <div className="relative w-16 h-16 md:w-20 md:h-20 mt-2">
              <Image
                src="/images/logo-universitas.png"
                alt="Logo Universitas Pasundan"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 card-shadow">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-cream-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-cream-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{graduationDate}</p>
                <p className="text-gray-600">Tanggal Wisuda</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-cream-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-cream-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{graduationTime}</p>
                <p className="text-gray-600">Waktu Acara</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 md:col-span-2">
              <div className="bg-cream-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-cream-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{venue}</p>
                <p className="text-gray-600">{address}</p>
              </div>
            </div>
          </div>
        </div>

             {/* Enhanced Scroll Indicator */}
        <div className="mt-16">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-cream-600 font-medium text-sm tracking-wider uppercase">Scroll untuk melihat lebih lanjut</p>
            <div className="group cursor-pointer">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border border-cream-200 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 animate-bounce">
                <ArrowDown className="w-6 h-6 text-cream-600 group-hover:translate-y-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
