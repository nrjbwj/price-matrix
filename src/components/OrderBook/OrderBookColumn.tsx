"use client";

import { Box } from "@mui/material";
import { OrderBookTableHeader } from "./OrderBookTableHeader";
import { OrderBookRow } from "./OrderBookRow";
import type { OrderWithCumulative } from "@/types";
import { DEFAULT_DEPTH } from "@/utils/constants";

interface OrderBookColumnProps {
  orders: OrderWithCumulative[];
  type: "bid" | "ask";
  maxCumulative: number;
  showBorderRight?: boolean;
}

export function OrderBookColumn({
  orders,
  type,
  maxCumulative,
  showBorderRight = false,
}: OrderBookColumnProps) {
  return (
    <Box
      sx={{
        borderRight: showBorderRight
          ? {
              xs: "none",
              lg: (theme) =>
                `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)"
                }`,
            }
          : "none",
      }}
    >
      <OrderBookTableHeader />
      <Box>
        {orders.slice(0, DEFAULT_DEPTH).map((order, index) => (
          <OrderBookRow
            key={`${type}-${order.price}-${index}`}
            order={order}
            type={type}
            maxCumulative={maxCumulative}
            isBest={index === 0}
          />
        ))}
      </Box>
    </Box>
  );
}

