"use client";

import { Box, CircularProgress } from "@mui/material";

interface LoadingStateProps {
  minHeight?: number;
  message?: string;
}

export function LoadingState({ minHeight = 400, message }: LoadingStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight,
        gap: 2,
      }}
    >
      <CircularProgress />
      {message && (
        <Box component="span" sx={{ color: "text.secondary" }}>
          {message}
        </Box>
      )}
    </Box>
  );
}

