"use client";

import { Box } from "@mui/material";
import { useState } from "react";
import { OrderBookTableHeader } from "./OrderBookTableHeader";
import { OrderBookRow } from "./OrderBookRow";
import type { OrderWithCumulative } from "@/types";
import { DEFAULT_DEPTH } from "@/utils/constants";
import { getThemeBorder } from "@/utils/theme";

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
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  return (
    <Box
      sx={{
        borderRight: showBorderRight
          ? {
              xs: "none",
              lg: (theme) => `1px solid ${getThemeBorder(theme)}`,
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
            onClick={() => setSelectedPrice(selectedPrice === order.price ? null : order.price)}
            isSelected={selectedPrice === order.price}
          />
        ))}
      </Box>
    </Box>
  );
}

