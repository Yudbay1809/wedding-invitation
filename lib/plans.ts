export type Plan = "free" | "premium" | "business";

export const PLAN_LIMITS: Record<Plan, { maxInvitations: number | null }> = {
  free: { maxInvitations: 1 },
  premium: { maxInvitations: 1 },
  business: { maxInvitations: null }
};

export const PLAN_FEATURES: Record<Plan, {
  premiumThemes: boolean;
  digitalGift: boolean;
  analytics: boolean;
  whiteLabel: boolean;
  customDomain: boolean;
  noWatermark: boolean;
}> = {
  free: {
    premiumThemes: false,
    digitalGift: false,
    analytics: false,
    whiteLabel: false,
    customDomain: false,
    noWatermark: false
  },
  premium: {
    premiumThemes: true,
    digitalGift: true,
    analytics: true,
    whiteLabel: false,
    customDomain: false,
    noWatermark: true
  },
  business: {
    premiumThemes: true,
    digitalGift: true,
    analytics: true,
    whiteLabel: true,
    customDomain: true,
    noWatermark: true
  }
};

export const THEME_ACCESS: Record<Plan, string[]> = {
  free: ["classic"],
  premium: ["classic", "minimal", "romantic", "luxury", "boho", "garden", "modern", "celestial"],
  business: ["classic", "minimal", "romantic", "luxury", "boho", "garden", "modern", "celestial"]
};


export function canCreateInvitation(plan: Plan, currentCount: number) {
  const limit = PLAN_LIMITS[plan].maxInvitations;
  if (limit === null) return true;
  return currentCount < limit;
}

export const DEFAULT_THEME_BY_PLAN: Record<Plan, "classic" | "minimal" | "romantic" | "luxury"> = {
  free: "classic",
  premium: "romantic",
  business: "luxury"
};

export type ThemeId = "classic" | "minimal" | "romantic" | "luxury" | "boho" | "garden" | "modern" | "celestial";

export const ALL_THEMES: ThemeId[] = [
  "classic",
  "minimal",
  "romantic",
  "luxury",
  "boho",
  "garden",
  "modern",
  "celestial"
];

export function resolveCheckoutTheme(plan: Plan, addonTheme?: string) {
  const baseTheme = DEFAULT_THEME_BY_PLAN[plan] ?? "classic";
  const addon = (addonTheme || "").toLowerCase();
  if (addon === "classic" || addon === "minimal" || addon === "romantic" || addon === "luxury" || addon === "boho" || addon === "garden" || addon === "modern" || addon === "celestial") {
    return addon as ThemeId;
  }
  return baseTheme;
}
