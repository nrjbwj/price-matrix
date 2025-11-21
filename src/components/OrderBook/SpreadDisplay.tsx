"use client";

import { Box, Typography } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
import { getBestBid, getBestAsk, calculateSpread, calculateSpreadPercentage } from "@/utils/calculations";

export function SpreadDisplay() {
  const { bids, asks } = useAppSelector((state) => state.orderBook);

  const spreadInfo = useMemo(() => {
    const bestBid = getBestBid(bids);
    const bestAsk = getBestAsk(asks);

    if (bestBid === null || bestAsk === null) {
      return { spread: 0, percentage: 0, bestBid: 0, bestAsk: 0 };
    }

    const spread = calculateSpread(bestBid, bestAsk);
    const percentage = calculateSpreadPercentage(bestBid, bestAsk);

    return { spread, percentage, bestBid, bestAsk };
  }, [bids, asks]);

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        padding: { xs: 1.5, md: 2 },
        borderTop: (theme) =>
          `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)"
          }`,
        borderBottom: (theme) =>
          `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)"
          }`,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: { xs: "0.65rem", md: "0.75rem" } }}>
            Best Bid
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "success.main",
              fontFamily: "monospace",
              fontSize: { xs: "0.875rem", md: "1.25rem" },
            }}
          >
            {spreadInfo.bestBid.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", flex: 1, px: { xs: 1, md: 2 } }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: { xs: "0.65rem", md: "0.75rem" } }}>
            Spread
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontFamily: "monospace",
              fontSize: { xs: "0.875rem", md: "1.25rem" },
            }}
          >
            {spreadInfo.spread.toFixed(2)}
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              sx={{ ml: { xs: 0.5, md: 1 }, fontSize: { xs: "0.65rem", md: "0.75rem" } }}
            >
              ({spreadInfo.percentage.toFixed(3)}%)
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: { xs: "0.65rem", md: "0.75rem" } }}>
            Best Ask
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "error.main",
              fontFamily: "monospace",
              fontSize: { xs: "0.875rem", md: "1.25rem" },
            }}
          >
            {spreadInfo.bestAsk.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

