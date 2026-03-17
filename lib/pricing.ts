import type { Plan } from "@/lib/plans";

const BASE_PRICE_BY_PLAN: Record<Plan, number> = {
  free: 0,
  premium: 499000,
  business: 1499000
};

const ADDON_THEME_PRICE: Record<string, number> = {
  classic: 0,
  minimal: 99000,
  romantic: 149000,
  luxury: 249000,
  boho: 129000,
  garden: 119000,
  modern: 139000,
  celestial: 159000
};

export function calculateCheckoutPrice(plan: Plan, addonTheme?: string) {
  const base = BASE_PRICE_BY_PLAN[plan] ?? 0;
  const addonKey = (addonTheme || "").toLowerCase();
  const addon = addonKey ? (ADDON_THEME_PRICE[addonKey] ?? 0) : 0;
  return {
    base,
    addon,
    total: base + addon,
    currency: "IDR"
  };
}
