"use client";

import { useMemo, useState } from "react";
import { calculateCheckoutPrice } from "@/lib/pricing";
import { createInvitationFromCheckout } from "@/app/actions/admin";

type ProfileOption = { id: string; full_name: string | null; username: string | null };

const THEMES = [
  { id: "classic", name: "Classic" },
  { id: "minimal", name: "Minimal" },
  { id: "romantic", name: "Romantic" },
  { id: "luxury", name: "Luxury" },
  { id: "boho", name: "Boho" },
  { id: "garden", name: "Garden" },
  { id: "modern", name: "Modern" },
  { id: "celestial", name: "Celestial" }
];

export function AdminCheckoutForm({ profiles }: { profiles: ProfileOption[] }) {
  const [plan, setPlan] = useState<"free" | "premium" | "business">("premium");
  const [addonTheme, setAddonTheme] = useState("");

  const price = useMemo(() => calculateCheckoutPrice(plan, addonTheme), [plan, addonTheme]);

  return (
    <form className="grid gap-4" action={createInvitationFromCheckout}>
      <div className="grid md:grid-cols-2 gap-3">
        <select name="user_id" className="rounded-xl border border-black/10 px-4 py-3" required>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.full_name ?? profile.username ?? profile.id}
            </option>
          ))}
        </select>
        <select
          name="plan"
          className="rounded-xl border border-black/10 px-4 py-3"
          value={plan}
          onChange={(event) => setPlan(event.target.value as "free" | "premium" | "business")}
        >
          <option value="free">FREE</option>
          <option value="premium">PREMIUM</option>
          <option value="business">BUSINESS</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <input name="title" placeholder="Judul undangan" className="rounded-xl border border-black/10 px-4 py-3" required />
        <input name="slug" placeholder="Slug" className="rounded-xl border border-black/10 px-4 py-3" required />
      </div>
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-center">
        <select
          name="addon_theme"
          className="rounded-xl border border-black/10 px-4 py-3"
          value={addonTheme}
          onChange={(event) => setAddonTheme(event.target.value)}
        >
          <option value="">Add-on: none (auto by plan)</option>
          {THEMES.map((theme) => (
            <option key={theme.id} value={theme.id}>Add-on: {theme.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-graphite">
          <input type="checkbox" name="theme_locked" value="true" defaultChecked />
          Lock tema
        </label>
      </div>
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-center">
        <select name="payment_status" className="rounded-xl border border-black/10 px-4 py-3" defaultValue="paid">
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refund">Refund</option>
        </select>
        <div className="text-xs text-graphite">
          Auto theme by plan: Free â†’ Classic, Premium â†’ Romantic, Business â†’ Luxury. Add-on akan override.
        </div>
      </div>
      <div className="rounded-xl border border-black/10 px-4 py-3 text-sm text-graphite">
        Price preview: <span className="font-semibold text-ink">IDR {price.total.toLocaleString("id-ID")}</span>
        <span className="ml-2 text-xs text-graphite">(Base {price.base.toLocaleString("id-ID")} + Add-on {price.addon.toLocaleString("id-ID")})</span>
      </div>
      <button className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white w-fit" type="submit">
        Create Invitation
      </button>
    </form>
  );
}

