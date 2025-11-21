import { useEffect, useRef, useCallback } from "react";
import { BinanceWebSocket } from "@/services/api/websocket";
import { useAppDispatch } from "@/store/hooks";
import { updateOrderBook, setWsStatus, setError } from "@/store/slices/orderBookSlice";
import type { TradingPair, ParsedDepthData, WebSocketStatus } from "@/types";

/**
 * Hook to manage WebSocket connection for order book updates
 */
export function useWebSocket(
  pair: TradingPair,
  isEnabled: boolean = true
) {
  const dispatch = useAppDispatch();
  const wsRef = useRef<BinanceWebSocket | null>(null);
  const currentPairRef = useRef<TradingPair>(pair);

  // Update current pair ref when pair changes
  useEffect(() => {
    currentPairRef.current = pair;
  }, [pair]);

  // Memoize callbacks to prevent recreating WebSocket on every render
  // Use ref to check current pair to avoid stale closures
  const handleMessage = useCallback((data: ParsedDepthData) => {
    // Only process messages if the pair hasn't changed
    if (currentPairRef.current === pair) {
      dispatch(
        updateOrderBook({
          bids: data.bids,
          asks: data.asks,
          lastUpdateId: data.lastUpdateId,
        })
      );
    }
  }, [dispatch, pair]);

  const handleStatusChange = useCallback((status: WebSocketStatus) => {
    // Only update status if the pair hasn't changed
    if (currentPairRef.current === pair) {
      dispatch(setWsStatus(status));
    }
  }, [dispatch, pair]);

  const handleError = useCallback((error: Error) => {
    // Only update error if the pair hasn't changed
    if (currentPairRef.current === pair) {
      dispatch(setError(error.message));
    }
  }, [dispatch, pair]);

  useEffect(() => {
    if (!isEnabled) {
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
      return;
    }

    // Disconnect old WebSocket first
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }

    // Small delay to ensure old connection is fully closed
    const timeoutId = setTimeout(() => {
      // Create WebSocket instance
      wsRef.current = new BinanceWebSocket(pair, {
        onMessage: handleMessage,
        onStatusChange: handleStatusChange,
        onError: handleError,
      });

      // Connect
      wsRef.current.connect();
    }, 100);

    // Cleanup on unmount or pair change
    return () => {
      clearTimeout(timeoutId);
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
    };
  }, [pair, isEnabled, handleMessage, handleStatusChange, handleError]);
}

