export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export interface UserHolding {
  id: string;
  cryptoId: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  purchasePrice: number;
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  current_price: number;
  price_change_percentage_24h: number;
  value: number;
  profit_loss: number;
  profit_loss_percentage: number;
}

export interface Portfolio {
  holdings: PortfolioHolding[];
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
}