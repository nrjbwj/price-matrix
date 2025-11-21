"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { useState, useMemo, createContext, useContext } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#1976d2",
          },
          success: {
            main: mode === "dark" ? "#4caf50" : "#2e7d32",
          },
          error: {
            main: mode === "dark" ? "#f44336" : "#d32f2f",
          },
          background: {
            default: mode === "dark" ? "#0a0a0a" : "#ffffff",
            paper: mode === "dark" ? "#1a1a1a" : "#ffffff",
          },
        },
        typography: {
          fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        },
      }),
    [mode]
  );

  // Always use the same theme to prevent hydration mismatch
  // The theme will be consistent between server and client
  const currentTheme = theme;

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
