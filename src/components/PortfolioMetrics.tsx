import React from 'react';
import { Portfolio } from '../types/crypto';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, BarChart3 } from 'lucide-react';

interface PortfolioMetricsProps {
  portfolio: Portfolio;
}

const PortfolioMetrics: React.FC<PortfolioMetricsProps> = ({ portfolio }) => {
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

  // Calculate additional metrics
  const bestPerformer = portfolio.holdings.reduce((best, current) => 
    current.profit_loss_percentage > best.profit_loss_percentage ? current : best
  );

  const worstPerformer = portfolio.holdings.reduce((worst, current) => 
    current.profit_loss_percentage < worst.profit_loss_percentage ? current : worst
  );

  const avgReturn = portfolio.holdings.length > 0 
    ? portfolio.holdings.reduce((sum, holding) => sum + holding.profit_loss_percentage, 0) / portfolio.holdings.length
    : 0;

  const totalGains = portfolio.holdings
    .filter(h => h.profit_loss > 0)
    .reduce((sum, h) => sum + h.profit_loss, 0);

  const totalLosses = Math.abs(portfolio.holdings
    .filter(h => h.profit_loss < 0)
    .reduce((sum, h) => sum + h.profit_loss, 0));

  const metrics = [
    {
      title: 'Total Value',
      value: formatPrice(portfolio.totalValue),
      subtitle: `Invested: ${formatPrice(totalInvested)}`,
      icon: DollarSign,
      color: 'teal',
      trend: null,
    },
    {
      title: 'Total P&L',
      value: `${isProfitPositive ? '+' : ''}${formatPrice(portfolio.totalProfitLoss)}`,
      subtitle: `${isProfitPositive ? '+' : ''}${portfolio.totalProfitLossPercentage.toFixed(2)}% return`,
      icon: isProfitPositive ? TrendingUp : TrendingDown,
      color: isProfitPositive ? 'green' : 'red',
      trend: isProfitPositive ? 'up' : 'down',
    },
    {
      title: 'Best Performer',
      value: bestPerformer.name,
      subtitle: `+${bestPerformer.profit_loss_percentage.toFixed(2)}%`,
      icon: Award,
      color: 'emerald',
      trend: 'up',
    },
    {
      title: 'Average Return',
      value: `${avgReturn >= 0 ? '+' : ''}${avgReturn.toFixed(2)}%`,
      subtitle: `Across ${portfolio.holdings.length} assets`,
      icon: BarChart3,
      color: avgReturn >= 0 ? 'green' : 'red',
      trend: avgReturn >= 0 ? 'up' : 'down',
    },
    {
      title: 'Total Gains',
      value: formatPrice(totalGains),
      subtitle: 'From winning positions',
      icon: TrendingUp,
      color: 'green',
      trend: 'up',
    },
    {
      title: 'Total Losses',
      value: formatPrice(totalLosses),
      subtitle: 'From losing positions',
      icon: TrendingDown,
      color: 'red',
      trend: 'down',
    },
  ];

  const getColorClasses = (color: string, trend: string | null) => {
    const colors = {
      teal: {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        icon: 'bg-teal-100 text-teal-600',
        text: 'text-teal-600',
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'bg-green-100 text-green-600',
        text: 'text-green-600',
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'bg-emerald-100 text-emerald-600',
        text: 'text-emerald-600',
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'bg-red-100 text-red-600',
        text: 'text-red-600',
      },
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const colorClasses = getColorClasses(metric.color, metric.trend);
        
        return (
          <div
            key={index}
            className={`bg-white/90 backdrop-blur-xl rounded-xl border ${colorClasses.border} p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider font-space">
                  {metric.title}
                </p>
                <p className="text-lg font-bold text-gray-900 font-space mb-1 truncate">
                  {metric.value}
                </p>
                <p className={`text-xs font-semibold ${colorClasses.text}`}>
                  {metric.subtitle}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${colorClasses.icon} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            
            {metric.trend && (
              <div className="flex items-center justify-end">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                  metric.trend === 'up' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.trend === 'up' ? 'Gain' : 'Loss'}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioMetrics;