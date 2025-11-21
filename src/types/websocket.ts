/**
 * WebSocket connection status
 */
export type WebSocketStatus = "connecting" | "connected" | "disconnected" | "error";

// Re-export depth types from api.ts for convenience
export type {
  BinanceDepthUpdate,
  ParsedDepthUpdate,
} from "./api";

