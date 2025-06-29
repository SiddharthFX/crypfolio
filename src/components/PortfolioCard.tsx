import React from 'react';
import { PortfolioHolding } from '../types/crypto';
import { TrendingUp, TrendingDown, Edit, Trash2, DollarSign, Percent, Calculator } from 'lucide-react';

interface PortfolioCardProps {
  holding: PortfolioHolding;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ holding, onEdit, onDelete }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: amount < 1 ? 6 : 2,
    }).format(amount);
  };

  const priceChange = holding.price_change_percentage_24h;
  const isPricePositive = priceChange >= 0;
  const isProfitPositive = holding.profit_loss >= 0;

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200/50 p-4 hover:border-gray-300/50 hover:bg-white transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={holding.image}
              alt={holding.name}
              className="w-12 h-12 rounded-full ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-300"
              loading="lazy"
            />
            <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
              isProfitPositive ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isProfitPositive ? (
                <TrendingUp className="h-2.5 w-2.5 text-white" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5 text-white" />
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm font-poppins">{holding.name}</h3>
            <p className="text-gray-500 text-xs uppercase font-semibold tracking-wider">{holding.symbol}</p>
          </div>
        </div>
        {onEdit && onDelete && (
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 border border-transparent hover:border-teal-200"
            >
              <Edit className="h-3 w-3" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50/80 rounded-lg p-2 border border-gray-100">
            <div className="flex items-center space-x-1 mb-1">
              <Calculator className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Holdings</span>
            </div>
            <p className="font-bold text-gray-900 font-poppins text-sm">
              {formatAmount(holding.amount)} {holding.symbol.toUpperCase()}
            </p>
          </div>
          <div className="bg-gray-50/80 rounded-lg p-2 border border-gray-100">
            <div className="flex items-center space-x-1 mb-1">
              <Percent className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">24h Change</span>
            </div>
            <p className={`font-bold font-poppins text-sm ${isPricePositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPricePositive ? '+' : ''}{priceChange.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="text-center py-3 bg-gradient-to-r from-gray-50/80 to-teal-50/30 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500 mb-1 font-medium">Current Price</p>
          <p className="text-xl font-bold text-gray-900 font-poppins">{formatPrice(holding.current_price)}</p>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Portfolio Value</span>
            <span className="font-bold text-lg text-gray-900 font-poppins">
              {formatPrice(holding.value)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Profit & Loss</span>
            <div className="text-right">
              <div className={`font-bold text-base font-poppins ${isProfitPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isProfitPositive ? '+' : ''}{formatPrice(holding.profit_loss)}
              </div>
              <div className={`text-xs font-bold ${isProfitPositive ? 'text-green-600' : 'text-red-600'}`}>
                ({isProfitPositive ? '+' : ''}{holding.profit_loss_percentage.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;