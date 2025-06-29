import React, { useState, useEffect } from 'react';
import { X, Save, Calculator } from 'lucide-react';
import { UserHolding } from '../types/crypto';

interface EditHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (holding: UserHolding) => void;
  holding: UserHolding | null;
}

const EditHoldingModal: React.FC<EditHoldingModalProps> = ({ isOpen, onClose, onSave, holding }) => {
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  useEffect(() => {
    if (holding) {
      setAmount(holding.amount.toString());
      setPurchasePrice(holding.purchasePrice.toString());
    }
  }, [holding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (holding && amount && purchasePrice) {
      onSave({
        ...holding,
        amount: parseFloat(amount),
        purchasePrice: parseFloat(purchasePrice),
      });
      onClose();
    }
  };

  if (!isOpen || !holding) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900 font-poppins">Edit Holding</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <img src={holding.image} alt={holding.name} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-medium text-gray-900 font-poppins">{holding.name}</div>
                <div className="text-sm text-gray-500">{holding.symbol.toUpperCase()}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amount Owned (in units)
            </label>
            <input
              type="number"
              step="any"
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
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
              required
            />
          </div>

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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/25"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHoldingModal;