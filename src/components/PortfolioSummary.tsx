import React from 'react';
import { Portfolio } from '../types/crypto';
import { Wallet, PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip, Pie } from 'recharts';
import PortfolioWaveChart from './PortfolioWaveChart';
import PortfolioMetrics from './PortfolioMetrics';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolio }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Prepare data for pie chart
  const pieData = portfolio.holdings.map((holding, index) => ({
    name: holding.symbol.toUpperCase(),
    value: holding.value,
    percentage: ((holding.value / portfolio.totalValue) * 100).toFixed(1),
    color: [
      '#14B8A6', '#06B6D4', '#10B981', '#F59E0B', 
      '#EF4444', '#6366F1', '#EC4899', '#8B5CF6'
    ][index % 8]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
          <p className="text-gray-900 font-semibold text-sm">{data.name}</p>
          <p className="text-gray-700 text-sm">{formatPrice(data.value)}</p>
          <p className="text-gray-500 text-xs">{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Portfolio Header */}
      <div className="bg-gradient-to-br from-white via-teal-50/50 to-cyan-50/50 rounded-2xl border border-gray-200 p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg shadow-teal-500/25">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-space">Portfolio Analytics</h2>
                <p className="text-gray-600 text-sm">Professional investment tracking & insights</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Total Holdings</p>
              <p className="text-xl font-bold text-gray-900 font-space">{portfolio.holdings.length} Assets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Metrics Grid */}
      <PortfolioMetrics portfolio={portfolio} />

      {/* Wave Chart */}
      <PortfolioWaveChart portfolio={portfolio} />

      {/* Portfolio Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200 p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="h-5 w-5 text-teal-600" />
            <h3 className="text-xl font-bold text-gray-900 font-space">Asset Allocation</h3>
          </div>
          <div className="space-y-4">
            {portfolio.holdings.map((holding, index) => {
              const percentage = (holding.value / portfolio.totalValue) * 100;
              const colors = [
                'bg-teal-500', 'bg-cyan-500', 'bg-green-500', 'bg-yellow-500', 
                'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-purple-500'
              ];
              return (
                <div key={holding.id} className="flex items-center space-x-4 p-3 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-colors">
                  <img src={holding.image} alt={holding.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900 font-space">{holding.name}</span>
                      <span className="text-sm text-gray-500 font-space">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 font-space">{formatPrice(holding.value)}</div>
                    <div className={`text-sm font-space ${holding.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {holding.profit_loss >= 0 ? '+' : ''}{formatPrice(holding.profit_loss)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 font-space">Distribution</h3>
          
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 font-space">{formatPrice(portfolio.totalValue)}</p>
                <p className="text-gray-600 text-sm font-space">Total Portfolio Value</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-bold text-green-600 font-space">
                  +{Math.max(...portfolio.holdings.map(h => h.profit_loss_percentage)).toFixed(2)}%
                </p>
                <p className="text-xs text-gray-600">Best Asset</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-bold text-red-600 font-space">
                  {Math.min(...portfolio.holdings.map(h => h.profit_loss_percentage)).toFixed(2)}%
                </p>
                <p className="text-xs text-gray-600">Worst Asset</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;