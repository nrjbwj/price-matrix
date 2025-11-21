import type { Order, OrderWithCumulative } from "@/types";

/**
 * Calculate cumulative sizes, totals, and sums for orders
 * For bids: cumulative from top (highest price)
 * For asks: cumulative from top (lowest price)
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

