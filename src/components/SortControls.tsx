import React from 'react';
import { ArrowUpDown, DollarSign, TrendingUp, Type, Hash } from 'lucide-react';

type SortOption = 'value' | 'performance' | 'name' | 'amount';

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'value' as SortOption, label: 'Value', icon: DollarSign },
    { value: 'performance' as SortOption, label: 'Performance', icon: TrendingUp },
    { value: 'name' as SortOption, label: 'Name', icon: Type },
    { value: 'amount' as SortOption, label: 'Amount', icon: Hash },
  ];

  return (
    <div className="flex items-center space-x-1.5 sm:space-x-2 w-full sm:w-auto">
      <ArrowUpDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500 flex-shrink-0" />
      <span className="text-[10px] xs:text-xs text-gray-500 font-medium hidden xs:inline">Sort by:</span>
      <div className="flex bg-white/80 rounded-lg border border-gray-200 p-0.5 shadow-sm flex-1 sm:flex-none overflow-x-auto">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`flex items-center space-x-1 px-1.5 xs:px-2 py-1 rounded-md text-[9px] xs:text-[10px] sm:text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                sortBy === option.value
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span className="hidden xs:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortControls;