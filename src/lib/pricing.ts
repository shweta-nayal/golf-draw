export const PLAN_PRICES = {
  monthly: 499,
  yearly: 4999,
} as const;

export const PRIZE_POOL_SHARE = 0.4; // 40% of every subscription goes to the prize pool
export const TIER_SHARE = { match_5: 0.4, match_4: 0.35, match_3: 0.25 } as const;

/** Format a number as Indian Rupees with the standard ₹1,23,456 grouping */
export function formatINR(n: number): string {
  if (n == null || isNaN(n as number)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
