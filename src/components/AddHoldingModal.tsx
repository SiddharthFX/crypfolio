import React, { useState } from 'react';
import { X, Plus, Calculator } from 'lucide-react';
import { Cryptocurrency } from '../types/crypto';

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (holding: { cryptoId: string; amount: number; purchasePrice: number }) => void;
  cryptos: Cryptocurrency[];
}

const AddHoldingModal: React.FC<AddHoldingModalProps> = ({ isOpen, onClose, onAdd, cryptos }) => {
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCrypto && amount && purchasePrice) {
      onAdd({
        cryptoId: selectedCrypto,
        amount: parseFloat(amount),
        purchasePrice: parseFloat(purchasePrice),
      });
      setSelectedCrypto('');
      setAmount('');
      setPurchasePrice('');
      setSearchTerm('');
      onClose();
    }
  };

  const selectedCryptoData = cryptos.find(c => c.id === selectedCrypto);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900 font-poppins">Add Holding</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Search Cryptocurrency
            </label>
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
            />
          </div>

          {searchTerm && (
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
              {filteredCryptos.slice(0, 10).map((crypto) => (
                <button
                  key={crypto.id}
                  type="button"
                  onClick={() => {
                    setSelectedCrypto(crypto.id);
                    setPurchasePrice(crypto.current_price.toString());
                    setSearchTerm('');
                  }}
                  className="w-full flex items-center space-x-3 p-4 hover:bg-gray-100 transition-colors text-left border-b border-gray-200 last:border-b-0"
                >
                  <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{crypto.name}</div>
                    <div className="text-sm text-gray-500">{crypto.symbol.toUpperCase()} • ${crypto.current_price.toLocaleString()}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedCryptoData && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <img src={selectedCryptoData.image} alt={selectedCryptoData.name} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-medium text-gray-900 font-poppins">{selectedCryptoData.name}</div>
                  <div className="text-sm text-gray-700">
                    Current Price: <span className="text-teal-600 font-semibold">${selectedCryptoData.current_price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amount Owned (in units)
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Purchase Price (USD per unit)
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
              required
            />
          </div>

          {selectedCryptoData && amount && purchasePrice && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Calculation Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Value:</span>
                  <span className="text-gray-900 font-semibold">
                    ${(parseFloat(amount) * selectedCryptoData.current_price).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Purchase Value:</span>
                  <span className="text-gray-900 font-semibold">
                    ${(parseFloat(amount) * parseFloat(purchasePrice)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-500">Profit/Loss:</span>
                  <span className={`font-semibold ${
                    (parseFloat(amount) * selectedCryptoData.current_price) - (parseFloat(amount) * parseFloat(purchasePrice)) >= 0 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${((parseFloat(amount) * selectedCryptoData.current_price) - (parseFloat(amount) * parseFloat(purchasePrice))).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedCrypto || !amount || !purchasePrice}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/25"
            >
              <Plus className="h-4 w-4" />
              <span>Add Holding</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHoldingModal;