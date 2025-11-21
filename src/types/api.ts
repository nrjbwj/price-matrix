import type { Order } from "./order";

/**
 * Binance depth data structure (used by both REST API and WebSocket)
 * Bids and asks are arrays of [price, size] tuples as strings
 */
export type BinanceDepthData = {
  lastUpdateId: number;
  bids: [string, string][]; // [price, size] as strings
  asks: [string, string][]; // [price, size] as strings
};

/**
 * Binance REST API depth response
 * Alias for BinanceDepthData for clarity
 */
export type BinanceDepthResponse = BinanceDepthData;

/**
 * Binance WebSocket depth update message
 * Alias for BinanceDepthData since @depth20@100ms sends snapshot-like updates
 */
export type BinanceDepthUpdate = BinanceDepthData;

/**
 * Parsed depth data with numeric values
 * Used for both REST API and WebSocket parsed responses
 */
export type ParsedDepthData = {
  lastUpdateId: number;
  bids: Order[];
  asks: Order[];
};

/**
 * Parsed REST API depth response
 * Alias for ParsedDepthData for clarity
 */
export type ParsedDepthResponse = ParsedDepthData;

/**
 * Parsed WebSocket depth update
 * Alias for ParsedDepthData for clarity
 */
export type ParsedDepthUpdate = ParsedDepthData;

