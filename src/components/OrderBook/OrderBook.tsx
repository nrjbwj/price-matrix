"use client";

import { Box, Typography, Alert, CircularProgress, Paper } from "@mui/material";
import { useOrderBook } from "@/hooks/useOrderBook";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { OrderBookRow } from "./OrderBookRow";
import { SpreadDisplay } from "./SpreadDisplay";
import { calculateCumulativeSizes } from "@/utils/calculations";
import { DEFAULT_DEPTH } from "@/utils/constants";
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
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 400,
            }}
          >
            <CircularProgress />
          </Box>
        )}

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
              <Box
                sx={{
                  borderRight: {
                    xs: "none",
                    lg: (theme) =>
                      `1px solid ${
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)"
                      }`,
                  },
                }}
              >
                {/* Bids Header */}
                <Box
                  sx={{
                    backgroundColor: "background.paper",
                    padding: { xs: 1, md: 2 },
                    borderBottom: (theme) =>
                      `1px solid ${
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)"
                      }`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingX: { xs: 1, md: 1.5 },
                      gap: { xs: 0.5, md: 0 },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        minWidth: { xs: 70, md: 100 },
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                        color: "text.primary",
                      }}
                    >
                      Price (USDT)
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        minWidth: { xs: 60, md: 100 },
                        textAlign: "right",
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                        color: "text.primary",
                      }}
                    >
                      Amount
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        minWidth: { xs: 60, md: 100 },
                        textAlign: "right",
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                        color: "text.primary",
                      }}
                    >
                      Total
                    </Typography>
                  </Box>
                </Box>
                {/* Bids */}
                <Box>
                  {processedData.bidsWithCumulative.slice(0, DEFAULT_DEPTH).map((bid, index) => (
                    <OrderBookRow
                      key={`bid-${bid.price}-${index}`}
                      order={bid}
                      type="bid"
                      maxCumulative={processedData.maxCumulative}
                      isBest={index === 0}
                    />
                  ))}
                </Box>
              </Box>

              {/* Asks Column */}
              <Box>
                {/* Asks Header */}
                <Box
                  sx={{
                    backgroundColor: "background.paper",
                    padding: { xs: 1, md: 2 },
                    borderBottom: (theme) =>
                      `1px solid ${
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)"
                      }`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingX: { xs: 1, md: 1.5 },
                      gap: { xs: 0.5, md: 0 },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        minWidth: { xs: 70, md: 100 },
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                        color: "text.primary",
                      }}
                    >
                      Price (USDT)
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        minWidth: { xs: 60, md: 100 },
                        textAlign: "right",
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                        color: "text.primary",
                      }}
                    >
                      Amount
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        minWidth: { xs: 60, md: 100 },
                        textAlign: "right",
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                        color: "text.primary",
                      }}
                    >
                      Total
                    </Typography>
                  </Box>
                </Box>
                {/* Asks */}
                <Box>
                  {processedData.asksWithCumulative.slice(0, DEFAULT_DEPTH).map((ask, index) => (
                    <OrderBookRow
                      key={`ask-${ask.price}-${index}`}
                      order={ask}
                      type="ask"
                      maxCumulative={processedData.maxCumulative}
                      isBest={index === 0}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Empty State */}
        {!isLoading && sortedBids.length === 0 && sortedAsks.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 400,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No order book data available
            </Typography>
          </Box>
        )}

        <Footer wsStatus={wsStatus} />
      </Box>
    </Box>
  );
}
