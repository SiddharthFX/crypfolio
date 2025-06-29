import React, { useState } from 'react';
import { Cryptocurrency } from '../types/crypto';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoCardProps {
  crypto: Cryptocurrency;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  const priceChange = crypto.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 hover:border-gray-300/50 hover:bg-white transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl group">
      <div className="flex items-center space-x-4 mb-5">
        <div className="relative w-12 h-12">
          {!imageLoaded && !imageError && (
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse ring-2 ring-gray-100"></div>
          )}
          {!imageError && (
            <img
              src={crypto.image}
              alt={crypto.name}
              className={`w-12 h-12 rounded-full ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          {imageError && (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-300">
              <span className="text-white font-bold text-sm font-space">
                {crypto.symbol.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base font-space leading-tight truncate">{crypto.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-gray-500 text-sm uppercase font-semibold tracking-wider font-space">{crypto.symbol}</p>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-400 font-medium">Rank #{crypto.market_cap_rank}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center py-4 bg-gradient-to-r from-gray-50/80 to-teal-50/30 rounded-xl border border-gray-100">
          <p className="text-2xl font-bold text-gray-900 mb-2 font-space">{formatPrice(crypto.current_price)}</p>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border transition-all duration-300 font-space ${
            isPositive 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1.5" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1.5" />
            )}
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50/80 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 font-space">Market Cap</p>
            <p className="font-bold text-gray-900 text-sm font-space">{formatMarketCap(crypto.market_cap)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50/80 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 font-space">Volume 24h</p>
            <p className="font-bold text-gray-900 text-sm font-space">{formatVolume(crypto.total_volume)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;