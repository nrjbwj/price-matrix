/**
 * Format price with appropriate decimal places
 */
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

/**
 * Format size/quantity
 */
export function formatSize(size: number): string {
  if (size >= 1000) {
    return size.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return size.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  });
}

/**
 * Format cumulative size
 */
export function formatCumulativeSize(size: number): string {
  return size.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(percentage: number, decimals: number = 3): string {
  return percentage.toFixed(decimals);
}

