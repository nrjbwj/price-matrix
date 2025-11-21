import type { TradingPair } from "@/types";

/**
 * Supported trading pairs
 */
export const TRADING_PAIRS: TradingPair[] = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
];

/**
 * Binance REST API base URL
 */
export const BINANCE_REST_API = "https://api.binance.com/api/v3";

/**
 * Binance WebSocket base URL
 */
export const BINANCE_WS_API = "wss://stream.binance.com:9443/ws";

/**
 * Get REST API endpoint for order book depth
 */
export function getDepthEndpoint(symbol: string, limit: number = 20): string {
  return `${BINANCE_REST_API}/depth?symbol=${symbol}&limit=${limit}`;
}

/**
 * Get WebSocket stream URL for order book depth
 */
export function getDepthWebSocketUrl(symbol: string): string {
  const lowerSymbol = symbol.toLowerCase();
  return `${BINANCE_WS_API}/${lowerSymbol}@depth20@100ms`;
}

