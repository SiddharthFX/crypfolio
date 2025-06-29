import React from 'react';
import { TrendingUp, BarChart3, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-12">
          <div className="flex items-center space-x-2.5">
            <div className="relative logo-icon p-2 rounded-lg shadow-md shadow-teal-500/20 transform hover:scale-105 transition-all duration-300">
              <div className="relative z-10 flex items-center justify-center">
                <div className="relative">
                  <BarChart3 className="h-4 w-4 text-white transform rotate-12" />
                  <TrendingUp className="h-2.5 w-2.5 text-white/90 absolute -top-0.5 -right-0.5 transform rotate-45" />
                  <Zap className="h-2 w-2 text-white/80 absolute -bottom-0.5 -left-0.5 transform -rotate-12" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold font-space brand-text tracking-tight leading-none hover:scale-105 transition-transform duration-300 cursor-default">
                Crypfolio
              </h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase -mt-0.5 font-inter">
                Portfolio Intelligence
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;