"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Box,
} from "@mui/material";
import { TRADING_PAIRS } from "@/utils/constants";
import type { TradingPair } from "@/types";

interface PairSelectorProps {
  selectedPair: TradingPair;
  onPairChange: (pair: TradingPair) => void;
}

export function PairSelector({ selectedPair, onPairChange }: PairSelectorProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onPairChange(event.target.value as TradingPair);
  };

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          marginBottom: 0.5,
          color: "text.secondary",
          fontSize: "0.75rem",
        }}
      >
        Instrument
      </Typography>
      <FormControl
        size="small"
        sx={{
          minWidth: 140,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "background.paper",
            "& fieldset": {
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.2)",
            },
            "&:hover fieldset": {
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(0, 0, 0, 0.3)",
            },
            "&.Mui-focused fieldset": {
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(0, 0, 0, 0.5)",
            },
          },
        }}
      >
        <Select
          value={selectedPair}
          onChange={handleChange}
          sx={{
            color: "text.primary",
            fontWeight: 600,
            "& .MuiSelect-select": {
              padding: "8px 32px 8px 12px",
            },
          }}
          displayEmpty
        >
          {TRADING_PAIRS.map((pair) => (
            <MenuItem key={pair} value={pair}>
              {pair}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

