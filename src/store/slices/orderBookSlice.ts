import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order, TradingPair, WebSocketStatus } from "@/types";

interface OrderBookState {
  selectedPair: TradingPair;
  bids: Order[];
  asks: Order[];
  lastUpdateId: number | null;
  wsStatus: WebSocketStatus;
  error: string | null;
}

const initialState: OrderBookState = {
  selectedPair: "BTCUSDT",
  bids: [],
  asks: [],
  lastUpdateId: null,
  wsStatus: "disconnected",
  error: null,
};

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    setSelectedPair: (state, action: PayloadAction<TradingPair>) => {
      state.selectedPair = action.payload;
      // Reset order book when pair changes
      state.bids = [];
      state.asks = [];
      state.lastUpdateId = null;
      state.error = null;
    },
    setOrderBook: (
      state,
      action: PayloadAction<{
        bids: Order[];
        asks: Order[];
        lastUpdateId: number;
      }>
    ) => {
      state.bids = action.payload.bids;
      state.asks = action.payload.asks;
      state.lastUpdateId = action.payload.lastUpdateId;
      state.error = null;
    },
    updateOrderBook: (
      state,
      action: PayloadAction<{
        bids: Order[];
        asks: Order[];
        lastUpdateId: number;
      }>
    ) => {
      // Replace the entire order book with new snapshot
      // (Binance @depth20@100ms sends full snapshots)
      state.bids = action.payload.bids;
      state.asks = action.payload.asks;
      state.lastUpdateId = action.payload.lastUpdateId;
    },
    setWsStatus: (state, action: PayloadAction<WebSocketStatus>) => {
      state.wsStatus = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSelectedPair,
  setOrderBook,
  updateOrderBook,
  setWsStatus,
  setError,
  clearError,
} = orderBookSlice.actions;

export default orderBookSlice.reducer;

