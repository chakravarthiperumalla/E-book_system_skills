import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-green-600">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold text-gray-900">E-Book Hub</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} E-Book Hub Inc. Secure digital delivery. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-green-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
