import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'lg', overlay = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const content = (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className={`animate-spin rounded-full border-3 border-gray-200 ${sizeClasses[size]}`}></div>
        <div className={`animate-spin rounded-full border-3 border-teal-500 border-t-transparent absolute top-0 left-0 ${sizeClasses[size]}`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse ${
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
          }`}></div>
        </div>
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
        {content}
      </div>
    );
  }

  return (
    <div className="py-16">
      {content}
    </div>
  );
};

export default LoadingSpinner;