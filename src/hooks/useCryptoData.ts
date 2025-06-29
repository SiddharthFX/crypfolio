import { useState, useEffect } from 'react';
import { Cryptocurrency } from '../types/crypto';

const API_KEY = 'CG-xeYiRJBxi27XnS4N3BRZhncE';
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';

export const useCryptoData = () => {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
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
      setCryptos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cryptocurrency data');
      console.error('Error fetching crypto data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { cryptos, loading, error, refetch: fetchCryptoData };
};