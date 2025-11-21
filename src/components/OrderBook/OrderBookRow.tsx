"use client";

import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import type { OrderWithCumulative } from "@/types";
import { formatPrice, formatSize } from "@/utils/formatting";

interface OrderBookRowProps {
  order: OrderWithCumulative;
  type: "bid" | "ask";
  maxCumulative: number;
  isBest?: boolean;
}

export function OrderBookRow({
  order,
  type,
  maxCumulative,
  isBest = false,
}: OrderBookRowProps) {
  const depthPercentage = useMemo(() => {
    return (order.cumulativeSize / maxCumulative) * 100;
  }, [order.cumulativeSize, maxCumulative]);

  return (
    <Box
      sx={{
        position: "relative",
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingX: { xs: 1, md: 1.5 },
        fontSize: { xs: "0.75rem", md: "0.875rem" },
        gap: { xs: 0.5, md: 0 },
        "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.04)",
        },
        transition: "background-color 0.2s",
        fontWeight: isBest ? 600 : 400,
      }}
    >
      {/* Depth bar */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          transition: "width 0.3s ease",
          backgroundColor:
            type === "bid"
              ? "rgba(76, 175, 80, 0.15)"
              : "rgba(244, 67, 54, 0.15)",
          width: `${depthPercentage}%`,
          right: type === "bid" ? 0 : "auto",
          left: type === "ask" ? 0 : "auto",
          zIndex: 0,
        }}
      />
      {/* Price */}
      <Typography
        sx={{
          position: "relative",
          zIndex: 1,
          minWidth: { xs: 80, md: 100 },
          fontFamily: "monospace",
          color: type === "bid" ? "success.main" : "error.main",
          fontSize: { xs: "0.75rem", md: "0.875rem" },
        }}
      >
        {formatPrice(order.price)}
      </Typography>
      {/* Amount */}
      <Typography
        sx={{
          position: "relative",
          zIndex: 1,
          minWidth: { xs: 70, md: 100 },
          textAlign: "right",
          fontFamily: "monospace",
          color: "text.primary",
          fontSize: { xs: "0.75rem", md: "0.875rem" },
        }}
      >
        {formatSize(order.size)}
      </Typography>
      {/* Total (cumulative size) */}
      <Typography
        sx={{
          position: "relative",
          zIndex: 1,
          minWidth: { xs: 70, md: 100 },
          textAlign: "right",
          fontFamily: "monospace",
          color: "text.secondary",
          fontSize: { xs: "0.75rem", md: "0.875rem" },
        }}
      >
        {formatSize(order.cumulativeSize)}
      </Typography>
    </Box>
  );
}
