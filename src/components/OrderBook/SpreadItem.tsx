"use client";

import { Box, Typography } from "@mui/material";
import { formatPrice } from "@/utils/formatting";

interface SpreadItemProps {
  label: string;
  value: number;
  color?: "success" | "error" | "default";
  showPercentage?: boolean;
  percentage?: number;
}

export function SpreadItem({
  label,
  value,
  color = "default",
  showPercentage = false,
  percentage,
}: SpreadItemProps) {
  const colorMap = {
    success: "success.main",
    error: "error.main",
    default: "text.primary",
  };

  return (
    <Box sx={{ textAlign: "center", flex: 1, px: showPercentage ? { xs: 1, md: 2 } : 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 0.5, fontSize: { xs: "0.65rem", md: "0.75rem" } }}
      >
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: colorMap[color],
          fontFamily: "monospace",
          fontSize: { xs: "0.875rem", md: "1.25rem" },
        }}
      >
        {formatPrice(value)}
        {showPercentage && percentage !== undefined && (
          <Typography
            component="span"
            variant="caption"
            color="text.secondary"
            sx={{ ml: { xs: 0.5, md: 1 }, fontSize: { xs: "0.65rem", md: "0.75rem" } }}
          >
            ({percentage.toFixed(3)}%)
          </Typography>
        )}
      </Typography>
    </Box>
  );
}

