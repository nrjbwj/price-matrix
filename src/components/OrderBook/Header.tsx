"use client";

import { Box, Typography } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import { PairSelector } from "./PairSelector";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { TradingPair } from "@/types";

interface HeaderProps {
  selectedPair: TradingPair;
  onPairChange: (pair: TradingPair) => void;
}

export function Header({ selectedPair, onPairChange }: HeaderProps) {
  return (
    <Box
      sx={{
        maxWidth: "72rem",
        marginX: "auto",
        marginBottom: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(76, 175, 80, 0.1)",
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TrendingUp
            sx={{
              width: 24,
              height: 24,
              color: "success.main",
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              fontSize: { xs: "1.875rem", md: "2rem" },
            }}
          >
            Order Book
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            Real-time Binance market depth
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingBottom: "4px",
          }}
        >
          <ThemeToggle />
        </Box>
        <PairSelector selectedPair={selectedPair} onPairChange={onPairChange} />
      </Box>
    </Box>
  );
}

