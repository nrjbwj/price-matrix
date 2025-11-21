"use client";

import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  message?: string;
  minHeight?: number;
}

export function EmptyState({
  message = "No order book data available",
  minHeight = 400,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight,
      }}
    >
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

