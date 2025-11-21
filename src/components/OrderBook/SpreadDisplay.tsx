"use client";

import { Box } from "@mui/material";
import { useMemo } from "react";
import { getBestBid, getBestAsk, calculateSpread, calculateSpreadPercentage } from "@/utils/calculations";
import type { Order } from "@/types";
import { getThemeBorder } from "@/utils/theme";
import { SpreadItem } from "./SpreadItem";

interface SpreadDisplayProps {
  sortedBids: Order[];
  sortedAsks: Order[];
}

export function SpreadDisplay({ sortedBids, sortedAsks }: SpreadDisplayProps) {
  const spreadInfo = useMemo(() => {
    const bestBid = getBestBid(sortedBids);
    const bestAsk = getBestAsk(sortedAsks);

    if (bestBid === null || bestAsk === null) {
      return { spread: 0, percentage: 0, bestBid: 0, bestAsk: 0 };
    }

    const spread = calculateSpread(bestBid, bestAsk);
    const percentage = calculateSpreadPercentage(bestBid, bestAsk);

    return { spread, percentage, bestBid, bestAsk };
  }, [sortedBids, sortedAsks]);

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        padding: { xs: 1.5, md: 2 },
        borderTop: (theme) => `1px solid ${getThemeBorder(theme)}`,
        borderBottom: (theme) => `1px solid ${getThemeBorder(theme)}`,
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

