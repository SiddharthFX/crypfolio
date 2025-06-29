import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import CryptoCard from './components/CryptoCard';
import PortfolioSummary from './components/PortfolioSummary';
import PortfolioCard from './components/PortfolioCard';
import LoadingSpinner from './components/LoadingSpinner';
import AddHoldingModal from './components/AddHoldingModal';
import EditHoldingModal from './components/EditHoldingModal';
import SortControls from './components/SortControls';
import { useCryptoData } from './hooks/useCryptoData';
import { useUserPortfolio } from './hooks/useUserPortfolio';
import { AlertCircle, RefreshCw, Wallet, BarChart3, Plus, TrendingUp, Calculator } from 'lucide-react';
import { UserHolding } from './types/crypto';

type SortOption = 'value' | 'performance' | 'name' | 'amount';

function App() {
  const { cryptos, loading, refreshing, error, refetch } = useCryptoData();
  const { portfolio, userHoldings, addHolding, updateHolding, removeHolding } = useUserPortfolio(cryptos);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio'>('market');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHolding, setEditingHolding] = useState<UserHolding | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('value');

  const filteredCryptos = useMemo(() => {
    if (!searchTerm) return cryptos;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(lowerSearchTerm) ||
        crypto.symbol.toLowerCase().includes(lowerSearchTerm)
    );
  }, [cryptos, searchTerm]);

  const sortedPortfolioHoldings = useMemo(() => {
    const holdings = [...portfolio.holdings];
    
    switch (sortBy) {
      case 'value':
        return holdings.sort((a, b) => b.value - a.value);
      case 'performance':
        return holdings.sort((a, b) => b.profit_loss_percentage - a.profit_loss_percentage);
      case 'name':
        return holdings.sort((a, b) => a.name.localeCompare(b.name));
      case 'amount':
        return holdings.sort((a, b) => b.amount - a.amount);
      default:
        return holdings;
    }
  }, [portfolio.holdings, sortBy]);

  const handleEditHolding = (holding: UserHolding) => {
    setEditingHolding(holding);
    setShowEditModal(true);
  };

  const handleDeleteHolding = (holdingId: string) => {
    if (window.confirm('Are you sure you want to remove this holding?')) {
      removeHolding(holdingId);
    }
  };

  const marketStats = useMemo(() => {
    if (cryptos.length === 0) return { totalMarketCap: 0, avgChange: 0, gainers: 0, losers: 0 };
    
    const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.market_cap, 0);
    const avgChange = cryptos.reduce((sum, crypto) => sum + crypto.price_change_percentage_24h, 0) / cryptos.length;
    const gainers = cryptos.filter(crypto => crypto.price_change_percentage_24h > 0).length;
    const losers = cryptos.filter(crypto => crypto.price_change_percentage_24h < 0).length;
    
    return { totalMarketCap, avgChange, gainers, losers };
  }, [cryptos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/30 text-gray-900 font-inter">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Hero Section - More Compact */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-xs font-semibold mb-4 border border-teal-200/50 shadow-sm">
            <TrendingUp className="h-3 w-3 mr-1.5" />
            Live Market Intelligence • Real-time Analytics
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-space bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 leading-tight tracking-tight">
            Professional Portfolio Analytics
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Advanced cryptocurrency portfolio management with real-time market intelligence from the top 100 digital assets
          </p>
        </div>

        {/* Tab Navigation - More Compact */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl p-1.5 border border-gray-200/60 shadow-lg">
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab('market')}
                className={`flex items-center justify-center space-x-2.5 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 min-w-[160px] font-space ${
                  activeTab === 'market'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/25 transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Market Intelligence</span>
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`flex items-center justify-center space-x-2.5 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 min-w-[160px] relative font-space ${
                  activeTab === 'portfolio'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/25 transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
              >
                <Calculator className="h-4 w-4" />
                <span>Portfolio Analytics</span>
                {portfolio.holdings.length > 0 && (
                  <span className={`absolute -top-1 -right-1 min-w-[18px] h-5 flex items-center justify-center text-xs px-1.5 py-0.5 rounded-full border font-bold ${
                    activeTab === 'portfolio' 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-teal-100 text-teal-600 border-teal-200'
                  }`}>
                    {portfolio.holdings.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">Error loading data</h3>
                <p className="text-red-600 text-xs mt-0.5">{error}</p>
              </div>
              <button
                onClick={refetch}
                className="ml-3 inline-flex items-center px-3 py-1.5 border border-red-200 text-xs font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {activeTab === 'market' ? (
              <>
                {/* Market Overview Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative">
                  {refreshing && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                  <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider font-space">Market Cap</p>
                        <p className="text-xl font-bold text-gray-900 font-space mb-1">
                          ${(marketStats.totalMarketCap / 1e12).toFixed(2)}T
                        </p>
                        <p className="text-xs text-gray-600">Top 100 cryptos</p>
                      </div>
                      <div className="p-2 bg-teal-100 rounded-lg border border-teal-200/50">
                        <TrendingUp className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider font-space">Avg 24h</p>
                        <p className={`text-xl font-bold font-space mb-1 ${marketStats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {marketStats.avgChange >= 0 ? '+' : ''}{marketStats.avgChange.toFixed(2)}%
                        </p>
                        <p className="text-xs text-gray-600">Market sentiment</p>
                      </div>
                      <div className={`p-2 rounded-lg border ${marketStats.avgChange >= 0 ? 'bg-green-100 border-green-200/50' : 'bg-red-100 border-red-200/50'}`}>
                        <BarChart3 className={`h-4 w-4 ${marketStats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider font-space">Gainers</p>
                        <p className="text-xl font-bold text-green-600 font-space mb-1">{marketStats.gainers}</p>
                        <p className="text-xs text-gray-600">Positive</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg border border-green-200/50">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider font-space">Losers</p>
                        <p className="text-xl font-bold text-red-600 font-space mb-1">{marketStats.losers}</p>
                        <p className="text-xs text-gray-600">Negative</p>
                      </div>
                      <div className="p-2 bg-red-100 rounded-lg border border-red-200/50">
                        <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>

                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

                {filteredCryptos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 max-w-md mx-auto shadow-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        {searchTerm ? 'No cryptocurrencies found matching your search.' : 'No data available.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 font-space mb-1">Live Market Intelligence</h3>
                        <p className="text-gray-600 text-sm">
                          Showing {filteredCryptos.length} of top 100 cryptocurrency{filteredCryptos.length !== 1 ? 'ies' : 'y'}
                        </p>
                      </div>
                      <button
                        onClick={refetch}
                        disabled={refreshing}
                        className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-xl border border-gray-300/50 text-xs font-semibold rounded-lg text-gray-700 hover:bg-white hover:border-gray-400/50 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-200 disabled:opacity-50 shadow-lg font-space"
                      >
                        <RefreshCw className={`h-3 w-3 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                      </button>
                    </div>

                    <div className="relative">
                      {refreshing && (
                        <LoadingSpinner overlay />
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredCryptos.map((crypto) => (
                          <CryptoCard key={crypto.id} crypto={crypto} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {portfolio.holdings.length > 0 && (
                  <PortfolioSummary portfolio={portfolio} />
                )}
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 font-space mb-1">Portfolio Analytics</h3>
                    <p className="text-gray-600 text-sm">
                      {portfolio.holdings.length === 0 
                        ? 'Add your cryptocurrency holdings to calculate portfolio value' 
                        : `Managing ${portfolio.holdings.length} holding${portfolio.holdings.length !== 1 ? 's' : ''} • Total Value: $${portfolio.totalValue.toLocaleString()}`
                      }
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {portfolio.holdings.length > 0 && (
                      <SortControls sortBy={sortBy} onSortChange={setSortBy} />
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-xl transform hover:scale-105 font-space"
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        Add Holding
                      </button>
                      <button
                        onClick={refetch}
                        disabled={refreshing}
                        className="inline-flex items-center px-3 py-2 bg-white/90 backdrop-blur-xl border border-gray-300/50 text-xs font-semibold rounded-lg text-gray-700 hover:bg-white hover:border-gray-400/50 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-200 disabled:opacity-50 shadow-lg font-space"
                      >
                        <RefreshCw className={`h-3 w-3 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                      </button>
                    </div>
                  </div>
                </div>

                {portfolio.holdings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 max-w-lg mx-auto shadow-lg">
                      <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/25">
                        <Calculator className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-space">Start Your Analysis</h3>
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        Add your cryptocurrency holdings to unlock professional portfolio analytics, performance tracking, and investment insights.
                      </p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-teal-500/25 transform hover:scale-105 font-space"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Holding
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {refreshing && (
                      <LoadingSpinner overlay />
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {sortedPortfolioHoldings.map((holding) => {
                        const userHolding = userHoldings.find(h => h.cryptoId === holding.id);
                        return (
                          <PortfolioCard 
                            key={holding.id} 
                            holding={holding}
                            onEdit={() => userHolding && handleEditHolding(userHolding)}
                            onDelete={() => userHolding && handleDeleteHolding(userHolding.id)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <Footer />

      <AddHoldingModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addHolding}
        cryptos={cryptos}
      />

      <EditHoldingModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingHolding(null);
        }}
        onSave={updateHolding}
        holding={editingHolding}
      />
    </div>
  );
}

export default App;