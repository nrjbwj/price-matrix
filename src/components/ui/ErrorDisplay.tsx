"use client";

import { Alert } from "@mui/material";

interface ErrorDisplayProps {
  error: string;
  severity?: "error" | "warning" | "info";
  onClose?: () => void;
}

export function ErrorDisplay({
  error,
  severity = "error",
  onClose,
}: ErrorDisplayProps) {
  return (
    <Alert severity={severity} sx={{ marginBottom: 2 }} onClose={onClose}>
      {error}
    </Alert>
  );
}

