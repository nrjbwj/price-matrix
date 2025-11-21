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
  isBest?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

export function OrderBookRow({
  order,
  type,
  maxCumulative,
  isBest = false,
  onClick,
  isSelected = false,
}: OrderBookRowProps) {
  const depthPercentage = useMemo(
    () => calculateDepthPercentage(order.cumulativeSize, maxCumulative),
    [order.cumulativeSize, maxCumulative]
  );

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingX: { xs: 1, md: 1.5 },
        fontSize: { xs: "0.75rem", md: "0.875rem" },
        gap: { xs: 0.5, md: 0 },
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
