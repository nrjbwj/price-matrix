"use client";

import { Box, Typography } from "@mui/material";
import { getThemeBorder } from "@/utils/theme";

export function OrderBookTableHeader() {
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
  );
}

