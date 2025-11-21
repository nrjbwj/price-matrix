import type { Order, OrderWithCumulative } from "@/types";

/**
 * Sort bids in descending order (highest price first)
 * 
 * NOTE: Binance API already returns bids sorted in descending order.
 * This function is kept for defensive purposes in case:
 * - API behavior changes in the future
 * - Data comes from a different source
 * - We need to ensure sort order for safety
 */
export function sortBids(bids: Order[]): Order[] {
  return [...bids].sort((a, b) => b.price - a.price);
}

/**
 * Sort asks in ascending order (lowest price first)
 * 
 * NOTE: Binance API already returns asks sorted in ascending order.
 * This function is kept for defensive purposes in case:
 * - API behavior changes in the future
 * - Data comes from a different source
 * - We need to ensure sort order for safety
 */
export function sortAsks(asks: Order[]): Order[] {
  return [...asks].sort((a, b) => a.price - b.price);
}

/**
 * Calculate depth percentage for visualization
 */
export function calculateDepthPercentage(
  cumulativeSize: number,
  maxCumulative: number
): number {
  if (maxCumulative === 0) return 0;
  return (cumulativeSize / maxCumulative) * 100;
}

/**
 * Get maximum cumulative size from processed order arrays
 * Returns separate maxes for bids and asks so each side can be visualized independently
 */
export function getMaxCumulative(
  bids: OrderWithCumulative[],
  asks: OrderWithCumulative[]
): { maxBid: number; maxAsk: number } {
  const maxBid = bids[bids.length - 1]?.cumulativeSize ?? 0;
  const maxAsk = asks[asks.length - 1]?.cumulativeSize ?? 0;
  return { maxBid, maxAsk };
}

/**
 * Get maximum cumulative sum (USDT value) from processed order arrays
 * Used for depth visualization based on USDT value
 * Returns separate maxes for bids and asks so each side can be visualized independently
 */
export function getMaxCumulativeSum(
  bids: OrderWithCumulative[],
  asks: OrderWithCumulative[]
): { maxBidSum: number; maxAskSum: number } {
  const maxBidSum = bids[bids.length - 1]?.sum ?? 0;
  const maxAskSum = asks[asks.length - 1]?.sum ?? 0;
  return { maxBidSum, maxAskSum };
}

