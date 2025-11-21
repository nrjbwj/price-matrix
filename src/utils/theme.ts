import type { Theme } from "@mui/material/styles";

/**
 * Get theme-aware border color
 * Returns a border color string that adapts to light/dark mode
 */
export function getThemeBorder(theme: Theme): string {
  return theme.palette.mode === "dark"
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";
}

/**
 * Get theme-aware hover background color
 * Returns a hover background color that adapts to light/dark mode
 */
export function getThemeHoverBackground(theme: Theme): string {
  return theme.palette.mode === "dark"
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(0, 0, 0, 0.04)";
}

