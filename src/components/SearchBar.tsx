import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search cryptocurrencies by name or symbol..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-xl border border-gray-300/50 rounded-xl leading-5 placeholder-gray-400 text-gray-900 focus:outline-none focus:placeholder-gray-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 text-sm shadow-lg hover:shadow-xl font-medium"
        />
      </div>
    </div>
  );
};

export default SearchBar;