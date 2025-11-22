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
import { getMaxCumulative } from "@/utils/orderBook";
import { getThemeBorder } from "@/utils/theme";
import { DEFAULT_DEPTH } from "@/utils/constants";
import { useMemo } from "react";

export function OrderBook() {
  const { selectedPair, wsStatus, changePair, bids, asks, error, isLoading } = useOrderBook();

  // Data is sorted defensively in Redux slice:
  // - Bids: descending (highest price first)
  // - Asks: ascending (lowest price first)

  // Process data with cumulative sizes
  const processedData = useMemo(() => {
    const bidsWithCumulative = calculateCumulativeSizes(bids);
    const asksWithCumulative = calculateCumulativeSizes(asks);
    
    // Calculate max from displayed rows only (DEFAULT_DEPTH) for proper depth visualization
    const displayedBids = bidsWithCumulative.slice(0, DEFAULT_DEPTH);
    const displayedAsks = asksWithCumulative.slice(0, DEFAULT_DEPTH);
    const maxCumulative = getMaxCumulative(displayedBids, displayedAsks);

    return { 
      bidsWithCumulative, 
      asksWithCumulative, 
      maxCumulative
    };
  }, [bids, asks]);

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
        {!isLoading && (bids.length > 0 || asks.length > 0) && (
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: "100%",
              backgroundColor: "background.paper",
              borderRadius: 1,
              overflow: "hidden",
              border: (theme) => `1px solid ${getThemeBorder(theme)}`,
              overflowX: "auto",
            }}
          >
            {/* Spread Display at Top */}
            <SpreadDisplay sortedBids={bids} sortedAsks={asks} />

            {/* Side by Side Layout */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "1fr 1fr",
                },
                borderTop: (theme) => `1px solid ${getThemeBorder(theme)}`,
              }}
            >
              {/* Bids Column */}
              <OrderBookColumn
                orders={processedData.bidsWithCumulative}
                type="bid"
                maxCumulative={processedData.maxCumulative.maxBid}
                selectedPair={selectedPair}
                showBorderRight
              />

              {/* Asks Column */}
              <OrderBookColumn
                orders={processedData.asksWithCumulative}
                type="ask"
                maxCumulative={processedData.maxCumulative.maxAsk}
                selectedPair={selectedPair}
              />
            </Box>
          </Paper>
        )}

        {/* Empty State */}
        {!isLoading && bids.length === 0 && asks.length === 0 && (
          <EmptyState />
        )}

        <Footer wsStatus={wsStatus} />
      </Box>
    </Box>
  );
}
