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
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 border border-teal-200/50 shadow-sm">
            <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 sm:mr-1.5" />
            <span className="hidden xs:inline">Live Market Intelligence • Real-time Analytics</span>
            <span className="xs:hidden">Live Market • Real-time</span>
          </div>
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold font-space bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight tracking-tight px-2">
            Professional Portfolio Analytics
          </h2>
          <p className="text-gray-600 text-xs xs:text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium px-4">
            <span className="hidden sm:inline">Advanced cryptocurrency portfolio management with real-time market intelligence from the top 100 digital assets</span>
            <span className="sm:hidden">Real-time crypto portfolio management and market intelligence</span>
          </p>
        </div>

        {/* Tab Navigation - Mobile Responsive */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-lg p-0.5 sm:p-1 border border-gray-200/60 shadow-md w-full max-w-xs sm:max-w-none sm:w-auto">
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab('market')}
                className={`flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-semibold text-[10px] xs:text-xs transition-all duration-300 flex-1 sm:flex-none sm:min-w-[120px] font-space ${
                  activeTab === 'market'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
              >
                <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Market</span>
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-semibold text-[10px] xs:text-xs transition-all duration-300 flex-1 sm:flex-none sm:min-w-[120px] relative font-space ${
                  activeTab === 'portfolio'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
              >
                <Calculator className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Portfolio</span>
                {portfolio.holdings.length > 0 && (
                  <span className={`absolute -top-0.5 -right-0.5 min-w-[14px] sm:min-w-[16px] h-3.5 sm:h-4 flex items-center justify-center text-[8px] sm:text-[10px] px-1 py-0.5 rounded-full border font-bold ${
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
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-lg mx-1 sm:mx-0">
            <div className="flex items-start sm:items-center">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-red-800">Error loading data</h3>
                <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 break-words">{error}</p>
              </div>
              <button
                onClick={refetch}
                className="ml-2 sm:ml-3 inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-red-200 text-[10px] sm:text-xs font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200 flex-shrink-0"
              >
                <RefreshCw className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                <span className="hidden xs:inline">Retry</span>
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
                {/* Market Overview Stats - Mobile Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6 relative">
                  {refreshing && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                  <div className="bg-white/90 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider font-space">Market Cap</p>
                        <p className="text-sm xs:text-base sm:text-xl font-bold text-gray-900 font-space mb-0.5 sm:mb-1 truncate">
                          ${(marketStats.totalMarketCap / 1e12).toFixed(2)}T
                        </p>
                        <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600">Top 100 cryptos</p>
                      </div>
                      <div className="p-1.5 sm:p-2 bg-teal-100 rounded-md sm:rounded-lg border border-teal-200/50 flex-shrink-0">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider font-space">Avg 24h</p>
                        <p className={`text-sm xs:text-base sm:text-xl font-bold font-space mb-0.5 sm:mb-1 truncate ${marketStats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {marketStats.avgChange >= 0 ? '+' : ''}{marketStats.avgChange.toFixed(2)}%
                        </p>
                        <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600">Market sentiment</p>
                      </div>
                      <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg border flex-shrink-0 ${marketStats.avgChange >= 0 ? 'bg-green-100 border-green-200/50' : 'bg-red-100 border-red-200/50'}`}>
                        <BarChart3 className={`h-3 w-3 sm:h-4 sm:w-4 ${marketStats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider font-space">Gainers</p>
                        <p className="text-sm xs:text-base sm:text-xl font-bold text-green-600 font-space mb-0.5 sm:mb-1">{marketStats.gainers}</p>
                        <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600">Positive</p>
                      </div>
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-md sm:rounded-lg border border-green-200/50 flex-shrink-0">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider font-space">Losers</p>
                        <p className="text-sm xs:text-base sm:text-xl font-bold text-red-600 font-space mb-0.5 sm:mb-1">{marketStats.losers}</p>
                        <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600">Negative</p>
                      </div>
                      <div className="p-1.5 sm:p-2 bg-red-100 rounded-md sm:rounded-lg border border-red-200/50 flex-shrink-0">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>

                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

                {filteredCryptos.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 max-w-md mx-auto shadow-lg">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {searchTerm ? 'No cryptocurrencies found matching your search.' : 'No data available.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                      <div className="w-full lg:w-auto">
                        <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 font-space mb-1">Live Market Intelligence</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Showing {filteredCryptos.length} of top 100 cryptocurrency{filteredCryptos.length !== 1 ? 'ies' : 'y'}
                        </p>
                      </div>
                      <button
                        onClick={refetch}
                        disabled={refreshing}
                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-xl border border-gray-300/50 text-[10px] xs:text-xs font-semibold rounded-lg text-gray-700 hover:bg-white hover:border-gray-400/50 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-200 disabled:opacity-50 shadow-lg font-space w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <RefreshCw className={`h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                      </button>
                    </div>

                    <div className="relative">
                      {refreshing && (
                        <LoadingSpinner overlay />
                      )}
                      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                  <div className="w-full lg:w-auto">
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 font-space mb-1">Portfolio Analytics</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {portfolio.holdings.length === 0 
                        ? 'Add your cryptocurrency holdings to calculate portfolio value' 
                        : `Managing ${portfolio.holdings.length} holding${portfolio.holdings.length !== 1 ? 's' : ''} • Total Value: $${portfolio.totalValue.toLocaleString()}`
                      }
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                    {portfolio.holdings.length > 0 && (
                      <div className="w-full sm:w-auto">
                        <SortControls sortBy={sortBy} onSortChange={setSortBy} />
                      </div>
                    )}
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[10px] xs:text-xs font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-xl transform hover:scale-105 font-space"
                      >
                        <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2" />
                        Add Holding
                      </button>
                      <button
                        onClick={refetch}
                        disabled={refreshing}
                        className="inline-flex items-center px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/90 backdrop-blur-xl border border-gray-300/50 text-[10px] xs:text-xs font-semibold rounded-lg text-gray-700 hover:bg-white hover:border-gray-400/50 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-200 disabled:opacity-50 shadow-lg font-space"
                      >
                        <RefreshCw className={`h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="hidden xs:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {portfolio.holdings.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 max-w-lg mx-auto shadow-lg">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-teal-500/25">
                        <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 font-space">Start Your Analysis</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed px-2">
                        Add your cryptocurrency holdings to unlock professional portfolio analytics, performance tracking, and investment insights.
                      </p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-teal-500/25 transform hover:scale-105 font-space"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Add Your First Holding
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {refreshing && (
                      <LoadingSpinner overlay />
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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