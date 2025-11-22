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
  const wsPairRef = useRef<TradingPair | null>(null); // Track which pair the WebSocket was created for
  const intendedPairRef = useRef<TradingPair | null>(null); // Track which pair we intend to create a WS for

  // Memoize callbacks to prevent recreating WebSocket on every render
  // Use ref to check if WebSocket pair matches current pair to avoid race conditions
  const handleMessage = useCallback((data: ParsedDepthData) => {
    // Only process messages if the WebSocket was created for the current pair
    // This prevents processing messages from a WebSocket created for a different pair
    if (wsPairRef.current === pair) {
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
    // Only update status if the WebSocket was created for the current pair
    if (wsPairRef.current === pair) {
      dispatch(setWsStatus(status));
    }
  }, [dispatch, pair]);

  const handleError = useCallback((error: Error) => {
    // Only update error if the WebSocket was created for the current pair
    if (wsPairRef.current === pair) {
      dispatch(setError(error.message));
    }
  }, [dispatch, pair]);

  useEffect(() => {
    if (!isEnabled) {
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
        wsPairRef.current = null;
      }
      intendedPairRef.current = null;
      return;
    }

    // Store the current pair for this effect
    const currentPairForEffect = pair;
    intendedPairRef.current = pair;

    // Disconnect old WebSocket first (synchronously)
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
      wsPairRef.current = null;
    }

    // Small delay to ensure old connection is fully closed
    const timeoutId = setTimeout(() => {
      // Double-check that we still intend to create a WS for this pair
      // If the pair changed, intendedPairRef will be different and we should abort
      if (intendedPairRef.current !== currentPairForEffect) {
        // Pair changed, don't create WebSocket
        return;
      }

      // Double-check that no WebSocket was created in the meantime
      if (wsPairRef.current !== null) {
        // Another WebSocket was created, don't create a duplicate
        return;
      }

      // Store the pair this WebSocket is created for
      wsPairRef.current = currentPairForEffect;
      
      // Create WebSocket instance
      wsRef.current = new BinanceWebSocket(currentPairForEffect, {
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
      // Clear intended pair if this effect is being cleaned up
      if (intendedPairRef.current === currentPairForEffect) {
        intendedPairRef.current = null;
      }
      // Disconnect WebSocket if it was created for this pair
      if (wsRef.current && wsPairRef.current === currentPairForEffect) {
        wsRef.current.disconnect();
        wsRef.current = null;
        wsPairRef.current = null;
      }
    };
  }, [pair, isEnabled, handleMessage, handleStatusChange, handleError]);
}

