import { useState, useEffect, useRef } from 'react';
import { Cryptocurrency } from '../types/crypto';

const API_KEY = 'CG-xeYiRJBxi27XnS4N3BRZhncE';
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';

export const useCryptoData = () => {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  const fetchCryptoData = async (isRefresh = false) => {
    try {
      if (isInitialLoad.current) {
        setLoading(true);
      } else if (isRefresh) {
        setRefreshing(true);
      }
      
      setError(null);

      const response = await fetch(
        `${API_URL}?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
        {
          headers: {
            'X-CG-Demo-API-Key': API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add a small delay to prevent flickering on fast connections
      if (!isInitialLoad.current) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setCryptos(data);
      isInitialLoad.current = false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cryptocurrency data');
      console.error('Error fetching crypto data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => fetchCryptoData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  return { 
    cryptos, 
    loading, 
    refreshing,
    error, 
    refetch: () => fetchCryptoData(true) 
  };
};