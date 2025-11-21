import type {
  BinanceDepthData,
  ParsedDepthData,
  WebSocketStatus,
} from "@/types";
import { parseDepthResponse } from "./binance";
import { getDepthWebSocketUrl } from "@/utils/constants";

export type WebSocketCallbacks = {
  onMessage: (data: ParsedDepthData) => void;
  onStatusChange?: (status: WebSocketStatus) => void;
  onError?: (error: Error) => void;
};

/**
 * WebSocket connection manager for Binance order book depth stream
 */
export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private callbacks: WebSocketCallbacks;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(symbol: string, callbacks: WebSocketCallbacks) {
    this.url = getDepthWebSocketUrl(symbol);
    this.callbacks = callbacks;
  }

  /**
   * Connect to WebSocket stream
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.updateStatus("connecting");

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.updateStatus("connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const data: BinanceDepthData = JSON.parse(event.data);
          const parsed = parseDepthResponse(data);
          this.callbacks.onMessage(parsed);
        } catch (error) {
          const err = new Error(
            `Failed to parse WebSocket message: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          this.callbacks.onError?.(err);
        }
      };

      this.ws.onerror = () => {
        this.updateStatus("error");
        this.callbacks.onError?.(
          new Error("WebSocket connection error occurred")
        );
      };

      this.ws.onclose = () => {
        this.updateStatus("disconnected");
        this.attemptReconnect();
      };
    } catch (error) {
      this.updateStatus("error");
      this.callbacks.onError?.(
        new Error(
          `Failed to create WebSocket connection: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        )
      );
    }
  }

  /**
   * Disconnect from WebSocket stream
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.updateStatus("disconnected");
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.updateStatus("error");
      this.callbacks.onError?.(
        new Error("Max reconnection attempts reached")
      );
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Update connection status and notify callback
   */
  private updateStatus(status: WebSocketStatus): void {
    this.callbacks.onStatusChange?.(status);
  }

  /**
   * Get current connection status
   */
  getStatus(): WebSocketStatus {
    if (!this.ws) return "disconnected";
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return "disconnected";
      default:
        return "disconnected";
    }
  }
}

