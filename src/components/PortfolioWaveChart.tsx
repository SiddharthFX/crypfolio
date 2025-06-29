import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Portfolio } from '../types/crypto';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface PortfolioWaveChartProps {
  portfolio: Portfolio;
}

const PortfolioWaveChart: React.FC<PortfolioWaveChartProps> = ({ portfolio }) => {
  // Generate mock historical data for demonstration
  const chartData = useMemo(() => {
    const days = 30;
    const data = [];
    const currentValue = portfolio.totalValue;
    const totalInvested = currentValue - portfolio.totalProfitLoss;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Create realistic portfolio value progression
      const progress = (days - i) / days;
      const volatility = Math.sin(i * 0.3) * 0.1 + Math.random() * 0.05 - 0.025;
      const trend = portfolio.totalProfitLossPercentage / 100;
      
      const value = totalInvested * (1 + (trend * progress) + volatility);
      const profitLoss = value - totalInvested;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.max(value, totalInvested * 0.7), // Prevent unrealistic drops
        profitLoss: profitLoss,
        invested: totalInvested,
      });
    }
    
    // Ensure the last data point matches current portfolio
    data[data.length - 1] = {
      ...data[data.length - 1],
      value: currentValue,
      profitLoss: portfolio.totalProfitLoss,
    };
    
    return data;
  }, [portfolio]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.profitLoss >= 0;
      
      return (
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-4 shadow-xl">
          <p className="text-gray-900 font-semibold text-sm mb-2 font-space">{label}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs">Portfolio Value:</span>
              <span className="font-bold text-gray-900 text-sm">{formatCurrency(data.value)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs">P&L:</span>
              <span className={`font-bold text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{formatCurrency(data.profitLoss)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs">Return:</span>
              <span className={`font-bold text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{((data.profitLoss / data.invested) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const isPositive = portfolio.totalProfitLoss >= 0;
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));
  const valueRange = maxValue - minValue;

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl shadow-lg ${
            isPositive 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/25' 
              : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/25'
          }`}>
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 font-space">Portfolio Performance</h3>
            <p className="text-gray-600 text-sm">30-day trend analysis</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border ${
            isPositive 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1.5" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1.5" />
            )}
            {isPositive ? '+' : ''}{portfolio.totalProfitLossPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              strokeOpacity={0.5}
            />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatCurrency}
              domain={[
                Math.max(0, minValue - valueRange * 0.1),
                maxValue + valueRange * 0.1
              ]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Invested amount baseline */}
            <Area
              type="monotone"
              dataKey="invested"
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="5 5"
              fill="url(#investedGradient)"
              fillOpacity={0.3}
            />
            
            {/* Portfolio value wave */}
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={3}
              fill="url(#portfolioGradient)"
              fillOpacity={1}
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: isPositive ? "#10b981" : "#ef4444",
                stroke: "#ffffff",
                strokeWidth: 2,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span className="text-xs text-gray-600 font-medium">Initial Investment</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-600 font-medium">Portfolio Value</span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioWaveChart;