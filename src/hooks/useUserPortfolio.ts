import { useState, useEffect } from 'react';
import { Portfolio, PortfolioHolding, Cryptocurrency, UserHolding } from '../types/crypto';

const STORAGE_KEY = 'crypto-portfolio-holdings';

export const useUserPortfolio = (cryptos: Cryptocurrency[]) => {
  const [userHoldings, setUserHoldings] = useState<UserHolding[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    holdings: [],
    totalValue: 0,
    totalProfitLoss: 0,
    totalProfitLossPercentage: 0,
  });

  // Load holdings from localStorage on mount
  useEffect(() => {
    const savedHoldings = localStorage.getItem(STORAGE_KEY);
    if (savedHoldings) {
      try {
        setUserHoldings(JSON.parse(savedHoldings));
      } catch (error) {
        console.error('Error loading saved holdings:', error);
      }
    }
  }, []);

  // Save holdings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userHoldings));
  }, [userHoldings]);

  // Calculate portfolio whenever cryptos or holdings change
  useEffect(() => {
    if (cryptos.length === 0 || userHoldings.length === 0) {
      setPortfolio({
        holdings: [],
        totalValue: 0,
        totalProfitLoss: 0,
        totalProfitLossPercentage: 0,
      });
      return;
    }

    const holdings: PortfolioHolding[] = userHoldings.map(holding => {
      const crypto = cryptos.find(c => c.id === holding.cryptoId);
      if (!crypto) {
        return null;
      }

      const currentValue = holding.amount * crypto.current_price;
      const purchaseValue = holding.amount * holding.purchasePrice;
      const profitLoss = currentValue - purchaseValue;
      const profitLossPercentage = purchaseValue > 0 ? (profitLoss / purchaseValue) * 100 : 0;

      return {
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        image: crypto.image,
        amount: holding.amount,
        current_price: crypto.current_price,
        price_change_percentage_24h: crypto.price_change_percentage_24h,
        value: currentValue,
        profit_loss: profitLoss,
        profit_loss_percentage: profitLossPercentage,
      };
    }).filter(Boolean) as PortfolioHolding[];

    const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
    const totalProfitLoss = holdings.reduce((sum, holding) => sum + holding.profit_loss, 0);
    const totalPurchaseValue = totalValue - totalProfitLoss;
    const totalProfitLossPercentage = totalPurchaseValue > 0 ? (totalProfitLoss / totalPurchaseValue) * 100 : 0;

    setPortfolio({
      holdings,
      totalValue,
      totalProfitLoss,
      totalProfitLossPercentage,
    });
  }, [cryptos, userHoldings]);

  const addHolding = (newHolding: { cryptoId: string; amount: number; purchasePrice: number }) => {
    const crypto = cryptos.find(c => c.id === newHolding.cryptoId);
    if (!crypto) return;

    const holding: UserHolding = {
      id: Date.now().toString(),
      cryptoId: newHolding.cryptoId,
      symbol: crypto.symbol,
      name: crypto.name,
      image: crypto.image,
      amount: newHolding.amount,
      purchasePrice: newHolding.purchasePrice,
    };

    setUserHoldings(prev => [...prev, holding]);
  };

  const updateHolding = (updatedHolding: UserHolding) => {
    setUserHoldings(prev => 
      prev.map(holding => 
        holding.id === updatedHolding.id ? updatedHolding : holding
      )
    );
  };

  const removeHolding = (holdingId: string) => {
    setUserHoldings(prev => prev.filter(holding => holding.id !== holdingId));
  };

  return {
    portfolio,
    userHoldings,
    addHolding,
    updateHolding,
    removeHolding,
  };
};