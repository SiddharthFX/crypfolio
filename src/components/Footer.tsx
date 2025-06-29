import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white/90 backdrop-blur-xl border-t border-gray-200/50 mt-12 shadow-lg shadow-gray-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm font-medium font-space">
                Data from <span className="text-teal-600 font-bold">CoinGecko</span> • {currentYear}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Real-time cryptocurrency market intelligence</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm font-medium font-space">
                Built by <span className="text-gray-900 font-bold">Siddharth N.R</span>
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Professional portfolio analytics platform</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;