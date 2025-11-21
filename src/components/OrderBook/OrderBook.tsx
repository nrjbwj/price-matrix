"use client";

import { Box, Paper } from "@mui/material";
import { useOrderBook } from "@/hooks/useOrderBook";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SpreadDisplay } from "./SpreadDisplay";
import { OrderBookColumn } from "./OrderBookColumn";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { EmptyState } from "./EmptyState";
import { calculateCumulativeSizes } from "@/utils/calculations";
import { useMemo } from "react";

export function OrderBook() {
  const { selectedPair, wsStatus, changePair, bids, asks, error, isLoading } = useOrderBook();

  // Sort bids descending and asks ascending
  const sortedBids = useMemo(() => {
    return [...bids].sort((a, b) => b.price - a.price);
  }, [bids]);

  const sortedAsks = useMemo(() => {
    return [...asks].sort((a, b) => a.price - b.price);
  }, [asks]);

  // Process data with cumulative sizes
  const processedData = useMemo(() => {
    const bidsWithCumulative = calculateCumulativeSizes(sortedBids);
    const asksWithCumulative = calculateCumulativeSizes(sortedAsks);

    const maxCumulative = Math.max(
      bidsWithCumulative[bidsWithCumulative.length - 1]?.cumulativeSize ?? 0,
      asksWithCumulative[asksWithCumulative.length - 1]?.cumulativeSize ?? 0
    );

    return { bidsWithCumulative, asksWithCumulative, maxCumulative };
  }, [sortedBids, sortedAsks]);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        padding: { xs: 2, md: 4 },
        overflowX: "hidden",
      }}
    >
      <Box sx={{ maxWidth: "72rem", margin: "0 auto" }}>
        <Header 
          selectedPair={selectedPair} 
          onPairChange={changePair}
        />

        {/* Error Display */}
        {error && <ErrorDisplay error={error} />}

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Order Book */}
        {!isLoading && (sortedBids.length > 0 || sortedAsks.length > 0) && (
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: "100%",
              backgroundColor: "background.paper",
              borderRadius: 1,
              overflow: "hidden",
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)"
                }`,
              overflowX: "auto",
            }}
          >
            {/* Spread Display at Top */}
            <SpreadDisplay />

            {/* Side by Side Layout */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "1fr 1fr",
                },
                borderTop: (theme) =>
                  `1px solid ${
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)"
                  }`,
              }}
            >
              {/* Bids Column */}
              <OrderBookColumn
                orders={processedData.bidsWithCumulative}
                type="bid"
                maxCumulative={processedData.maxCumulative}
                showBorderRight
              />

              {/* Asks Column */}
              <OrderBookColumn
                orders={processedData.asksWithCumulative}
                type="ask"
                maxCumulative={processedData.maxCumulative}
              />
            </Box>
          </Paper>
        )}

        {/* Empty State */}
        {!isLoading && sortedBids.length === 0 && sortedAsks.length === 0 && (
          <EmptyState />
        )}

        <Footer wsStatus={wsStatus} />
      </Box>
    </Box>
  );
}
