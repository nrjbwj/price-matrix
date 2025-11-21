import { useQuery } from "@tanstack/react-query";
import { fetchOrderBookDepth } from "@/services/api/binance";
import { useAppDispatch } from "@/store/hooks";
import { setOrderBook, setError } from "@/store/slices/orderBookSlice";
import type { TradingPair } from "@/types";
import { useEffect } from "react";

/**
 * Hook to fetch initial order book data using Tanstack Query
 */
export function useOrderBookData(
  pair: TradingPair,
  enabled: boolean = true
) {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ["orderBook", pair],
    queryFn: () => fetchOrderBookDepth(pair),
    enabled,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Update Redux store when data is fetched
  // Include pair in dependencies to ensure we only update for current pair
  useEffect(() => {
    if (query.data) {
      dispatch(
        setOrderBook({
          bids: query.data.bids,
          asks: query.data.asks,
          lastUpdateId: query.data.lastUpdateId,
        })
      );
    }
  }, [query.data, pair, dispatch]);

  // Update error in Redux store
  useEffect(() => {
    if (query.error) {
      dispatch(
        setError(
          query.error instanceof Error
            ? query.error.message
            : "Failed to fetch order book data"
        )
      );
    }
  }, [query.error, dispatch]);

  return query;
}

