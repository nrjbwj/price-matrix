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
  private isIntentionallyDisconnected = false; // Flag to prevent reconnection on intentional disconnect

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

    // Reset intentional disconnect flag when connecting
    this.isIntentionallyDisconnected = false;

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
        // Only attempt reconnection if this wasn't an intentional disconnect
        if (!this.isIntentionallyDisconnected) {
          this.attemptReconnect();
        }
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
    // Set flag to prevent reconnection attempts
    this.isIntentionallyDisconnected = true;

    // Clear any pending reconnection attempts
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Close WebSocket if it exists and is not already closed
    if (this.ws) {
      // Remove event handlers to prevent reconnection
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.onopen = null;

      // Close the connection
      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      ) {
        this.ws.close();
      }
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

