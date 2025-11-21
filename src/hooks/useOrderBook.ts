import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedPair } from "@/store/slices/orderBookSlice";
import { useOrderBookData } from "./useOrderBookData";
import { useWebSocket } from "./useWebSocket";

/**
 * Main hook to manage order book data flow
 * Handles REST API fetch and WebSocket connection
 */
export function useOrderBook() {
  const dispatch = useAppDispatch();
  const { selectedPair, bids, asks, wsStatus, error } = useAppSelector(
    (state) => state.orderBook
  );

  // Fetch initial data via REST API (using default depth)
  const { isLoading, isError } = useOrderBookData(selectedPair);

  // Connect to WebSocket for real-time updates
  // Only connect after initial data is loaded
  useWebSocket(selectedPair, !isLoading && !isError);

  // Function to change trading pair
  const changePair = (pair: typeof selectedPair) => {
    dispatch(setSelectedPair(pair));
  };

  return {
    selectedPair,
    bids,
    asks,
    wsStatus,
    error,
    isLoading,
    isError,
    changePair,
  };
}

