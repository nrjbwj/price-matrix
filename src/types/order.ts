/**
 * Core Order type representing a single order entry
 */
export type Order = {
  price: number;
  size: number;
};

/**
 * Order with cumulative size for display
 */
export type OrderWithCumulative = Order & {
  cumulativeSize: number;
};

/**
 * Order book data structure
 */
export type OrderBook = {
  bids: Order[];
  asks: Order[];
};

/**
 * Order book with cumulative sizes
 */
export type OrderBookWithCumulative = {
  bids: OrderWithCumulative[];
  asks: OrderWithCumulative[];
};

/**
 * Supported trading pairs
 */
export type TradingPair = "BTCUSDT" | "ETHUSDT" | "BNBUSDT" | "SOLUSDT";

