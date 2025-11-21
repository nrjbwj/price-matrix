import type { Order, OrderWithCumulative } from "@/types";

/**
 * Calculate cumulative sizes, totals, and sums for orders
 * 
 * Cumulative size accumulates from top to bottom:
 * - For bids: cumulative from top (highest price) downward
 *   Example: Row 1 (top) = 5, Row 2 = 8, Row 3 = 10 (increasing downward)
 * - For asks: cumulative from top (lowest price) downward
 *   Example: Row 1 (top) = 2, Row 2 = 5, Row 3 = 9 (increasing downward)
 * 
 * This is standard order book behavior where cumulative size increases
 * as you go down the order book (away from the best price).
 */
export function calculateCumulativeSizes(orders: Order[]): OrderWithCumulative[] {
  let cumulativeSize = 0;
  let cumulativeSum = 0;
  return orders.map((order) => {
    const total = order.price * order.size;
    cumulativeSize += order.size;
    cumulativeSum += total;
    return {
      ...order,
      cumulativeSize,
      total,
      sum: cumulativeSum,
    };
  });
}

/**
 * Calculate spread (difference between best ask and best bid)
 */
export function calculateSpread(bestBid: number, bestAsk: number): number {
  return bestAsk - bestBid;
}

/**
 * Calculate spread percentage
 */
export function calculateSpreadPercentage(
  bestBid: number,
  bestAsk: number
): number {
  if (bestBid === 0) return 0;
  return ((bestAsk - bestBid) / bestBid) * 100;
}

/**
 * Get best bid (highest price from bids)
 */
export function getBestBid(bids: Order[]): number | null {
  if (bids.length === 0) return null;
  return bids[0]?.price ?? null;
}

/**
 * Get best ask (lowest price from asks)
 */
export function getBestAsk(asks: Order[]): number | null {
  if (asks.length === 0) return null;
  return asks[0]?.price ?? null;
}

