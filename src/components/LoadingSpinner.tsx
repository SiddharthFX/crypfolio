import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;