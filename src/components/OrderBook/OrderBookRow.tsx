"use client";

import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import type { OrderWithCumulative } from "@/types";
import { formatPrice, formatSize } from "@/utils/formatting";
import { calculateDepthPercentage } from "@/utils/orderBook";
import { getThemeHoverBackground } from "@/utils/theme";

interface OrderBookRowProps {
  order: OrderWithCumulative;
  type: "bid" | "ask";
  maxCumulative: number;
  maxCumulativeSum?: number; // Optional: for depth based on sum
  isBest?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

export function OrderBookRow({
  order,
  type,
  maxCumulative,
  maxCumulativeSum,
  isBest = false,
  onClick,
  isSelected = false,
}: OrderBookRowProps) {
  // Use sum for depth if provided, otherwise fall back to cumulativeSize
  const depthPercentage = useMemo(() => {
    if (maxCumulativeSum !== undefined) {
      return calculateDepthPercentage(order.sum, maxCumulativeSum);
    }
    return calculateDepthPercentage(order.cumulativeSize, maxCumulative);
  }, [order.cumulativeSize, order.sum, maxCumulative, maxCumulativeSum]);

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingX: { xs: 0.75, md: 1.5 },
        fontSize: { xs: "0.7rem", md: "0.875rem" },
        gap: { xs: 0.25, md: 0 },
        cursor: onClick ? "pointer" : "default",
        backgroundColor: isSelected
          ? (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(76, 175, 80, 0.2)"
                : "rgba(76, 175, 80, 0.1)"
          : "transparent",
        "&:hover": {
          backgroundColor: (theme) => getThemeHoverBackground(theme),
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
          transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
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
          minWidth: { xs: 70, md: 100 },
          fontFamily: "monospace",
          color: type === "bid" ? "success.main" : "error.main",
          fontSize: { xs: "0.7rem", md: "0.875rem" },
        }}
      >
        {formatPrice(order.price)}
      </Typography>
      {/* Amount */}
      <Typography
        sx={{
          position: "relative",
          zIndex: 1,
          minWidth: { xs: 60, md: 100 },
          textAlign: "right",
          fontFamily: "monospace",
          color: "text.primary",
          fontSize: { xs: "0.7rem", md: "0.875rem" },
        }}
      >
        {formatSize(order.size)}
      </Typography>
      {/* Total (price * size for this row) */}
      <Typography
        sx={{
          position: "relative",
          zIndex: 1,
          minWidth: { xs: 60, md: 100 },
          textAlign: "right",
          fontFamily: "monospace",
          color: "text.secondary",
          fontSize: { xs: "0.7rem", md: "0.875rem" },
        }}
      >
        {formatPrice(order.total)}
      </Typography>
      {/* Sum (cumulative total in USDT) */}
      <Typography
        sx={{
          position: "relative",
          zIndex: 1,
          minWidth: { xs: 60, md: 100 },
          textAlign: "right",
          fontFamily: "monospace",
          color: "text.secondary",
          fontSize: { xs: "0.7rem", md: "0.875rem" },
        }}
      >
        {formatPrice(order.sum)}
      </Typography>
    </Box>
  );
}
