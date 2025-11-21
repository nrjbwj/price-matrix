"use client";

import { Box, Typography } from "@mui/material";
import type { TradingPair } from "@/types";
import { getInstrumentName } from "@/utils/constants";
import { getThemeBorder } from "@/utils/theme";

interface OrderBookTableHeaderProps {
  selectedPair: TradingPair;
}

export function OrderBookTableHeader({ selectedPair }: OrderBookTableHeaderProps) {
  const instrumentName = getInstrumentName(selectedPair);
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        padding: { xs: 1, md: 2 },
        borderBottom: (theme) => `1px solid ${getThemeBorder(theme)}`,
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
            fontSize: { xs: "0.6rem", md: "0.75rem" },
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
            fontSize: { xs: "0.6rem", md: "0.75rem" },
            color: "text.primary",
          }}
        >
          Size ({instrumentName})
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            minWidth: { xs: 60, md: 100 },
            textAlign: "right",
            fontSize: { xs: "0.6rem", md: "0.75rem" },
            color: "text.primary",
          }}
        >
          Cumulative Size ({instrumentName})
        </Typography>
      </Box>
    </Box>
  );
}

