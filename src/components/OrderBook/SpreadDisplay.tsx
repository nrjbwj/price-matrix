"use client";

import { Box } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
import { getBestBid, getBestAsk, calculateSpread, calculateSpreadPercentage } from "@/utils/calculations";
import { SpreadItem } from "./SpreadItem";

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
        <SpreadItem label="Best Bid" value={spreadInfo.bestBid} color="success" />
        <SpreadItem
          label="Spread"
          value={spreadInfo.spread}
          color="default"
          showPercentage
          percentage={spreadInfo.percentage}
        />
        <SpreadItem label="Best Ask" value={spreadInfo.bestAsk} color="error" />
      </Box>
    </Box>
  );
}

