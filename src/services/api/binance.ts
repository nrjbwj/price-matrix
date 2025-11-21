import type {
  BinanceDepthData,
  ParsedDepthData,
  Order,
  TradingPair,
} from "@/types";
import { getDepthEndpoint } from "@/utils/constants";

/**
 * Parse string tuple [price, size] to Order object
 */
function parseOrder([price, size]: [string, string]): Order {
  return {
    price: parseFloat(price),
    size: parseFloat(size),
  };
}

/**
 * Parse Binance depth data to Order array
 */
function parseOrders(orders: [string, string][]): Order[] {
  return orders.map(parseOrder);
}

/**
 * Parse Binance depth response to ParsedDepthData
 */
export function parseDepthResponse(
  data: BinanceDepthData
): ParsedDepthData {
  return {
    lastUpdateId: data.lastUpdateId,
    bids: parseOrders(data.bids),
    asks: parseOrders(data.asks),
  };
}

/**
 * Fetch order book depth from Binance REST API
 */
export async function fetchOrderBookDepth(
  symbol: TradingPair,
  limit: number = 20
): Promise<ParsedDepthData> {
  const url = getDepthEndpoint(symbol, limit);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BinanceDepthData = await response.json();
    return parseDepthResponse(data);
  } catch (error) {
    throw new Error(
      `Failed to fetch order book depth for ${symbol}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

