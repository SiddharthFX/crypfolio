import React from 'react';
import { Portfolio } from '../types/crypto';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Target, PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip, Pie } from 'recharts';

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

  const isProfitPositive = portfolio.totalProfitLoss >= 0;
  const totalInvested = portfolio.totalValue - portfolio.totalProfitLoss;

  // Calculate top performer
  const topPerformer = portfolio.holdings.reduce((best, current) => 
    current.profit_loss_percentage > best.profit_loss_percentage ? current : best
  );

  // Prepare data for pie chart
  const pieData = portfolio.holdings.map((holding, index) => ({
    name: holding.symbol.toUpperCase(),
    value: holding.value,
    percentage: ((holding.value / portfolio.totalValue) * 100).toFixed(1),
    color: [
      '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', 
      '#EF4444', '#6366F1', '#EC4899', '#14B8A6'
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
    <div className="mb-8">
      {/* Main Portfolio Overview */}
      <div className="bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 rounded-2xl border border-gray-200 p-6 mb-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">Portfolio Overview</h2>
                <p className="text-gray-600 text-sm">Real-time performance tracking</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Total Holdings</p>
              <p className="text-xl font-bold text-gray-900 font-poppins">{portfolio.holdings.length} Assets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700 font-medium text-sm">Portfolio Value</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1 font-poppins">{formatPrice(portfolio.totalValue)}</p>
              <p className="text-gray-500 text-xs">Total invested: {formatPrice(totalInvested)}</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                {isProfitPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className="text-gray-700 font-medium text-sm">Total P&L</span>
              </div>
              <p className={`text-2xl font-bold mb-1 font-poppins ${isProfitPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isProfitPositive ? '+' : ''}{formatPrice(portfolio.totalProfitLoss)}
              </p>
              <p className={`text-xs ${isProfitPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isProfitPositive ? '+' : ''}{portfolio.totalProfitLossPercentage.toFixed(2)}% return
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-yellow-600" />
                <span className="text-gray-700 font-medium text-sm">Top Performer</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mb-1 font-poppins">{topPerformer.name}</p>
              <p className={`text-xs font-semibold ${
                topPerformer.profit_loss_percentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {topPerformer.profit_loss_percentage >= 0 ? '+' : ''}{topPerformer.profit_loss_percentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Allocation with Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-4 w-4 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900 font-poppins">Portfolio Allocation</h3>
          </div>
          <div className="space-y-3">
            {portfolio.holdings.map((holding, index) => {
              const percentage = (holding.value / portfolio.totalValue) * 100;
              const colors = [
                'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 
                'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
              ];
              return (
                <div key={holding.id} className="flex items-center space-x-3">
                  <img src={holding.image} alt={holding.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-900 font-poppins text-sm">{holding.name}</span>
                      <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-sm">{formatPrice(holding.value)}</div>
                    <div className={`text-xs ${holding.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {holding.profit_loss >= 0 ? '+' : ''}{formatPrice(holding.profit_loss)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4 font-poppins">Portfolio Distribution</h3>
          
          <div className="h-48 mb-4">
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

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500 text-xs">Best Performer</span>
                <span className="text-green-600 font-semibold text-sm">
                  +{Math.max(...portfolio.holdings.map(h => h.profit_loss_percentage)).toFixed(2)}%
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500 text-xs">Worst Performer</span>
                <span className="text-red-600 font-semibold text-sm">
                  {Math.min(...portfolio.holdings.map(h => h.profit_loss_percentage)).toFixed(2)}%
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500 text-xs">Avg. Return</span>
                <span className={`font-semibold text-sm ${
                  portfolio.totalProfitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {portfolio.totalProfitLossPercentage >= 0 ? '+' : ''}{portfolio.totalProfitLossPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900 font-poppins">{formatPrice(portfolio.totalValue)}</p>
                <p className="text-gray-500 text-xs">Total Portfolio Value</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;