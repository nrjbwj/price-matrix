"use client";

import { Box, Typography } from "@mui/material";
import type { WebSocketStatus } from "@/types";
import { getThemeBorder } from "@/utils/theme";

interface FooterProps {
  wsStatus: WebSocketStatus;
}

export function Footer({ wsStatus }: FooterProps) {
  return (
    <Box
      sx={{
        marginTop: 3,
        paddingTop: 2,
        borderTop: (theme) => `1px solid ${getThemeBorder(theme)}`,
        textAlign: "center",
      }}
    >
      <Typography variant="caption" color="text.secondary">
        Live data from Binance WebSocket • Updates every 100ms • Status: {wsStatus}
      </Typography>
    </Box>
  );
}

