import React from 'react';
import { MapPin, Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Lead<span className="text-blue-600">Scout</span></h1>
        </div>
        <div className="text-sm text-gray-500 hidden sm:block">
          Automated Local Business Discovery
        </div>
      </div>
    </header>
  );
};