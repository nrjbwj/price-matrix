import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order, TradingPair, WebSocketStatus } from "@/types";
import { sortBids, sortAsks } from "@/utils/orderBook";

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
      // Sort defensively to ensure correct order even if API doesn't guarantee it
      // Bids: descending (highest price first)
      // Asks: ascending (lowest price first)
      state.bids = sortBids(action.payload.bids);
      state.asks = sortAsks(action.payload.asks);
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
      // Sort defensively to ensure correct order even if API doesn't guarantee it
      state.bids = sortBids(action.payload.bids);
      state.asks = sortAsks(action.payload.asks);
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

