"use client";

import { Box, Typography } from "@mui/material";

export function OrderBookTableHeader() {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        padding: { xs: 1, md: 2 },
        borderBottom: (theme) =>
          `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)"
          }`,
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

