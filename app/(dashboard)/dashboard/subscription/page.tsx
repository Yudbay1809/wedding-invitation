import { PricingCard } from "@/components/ui/PricingCard";

export default function SubscriptionPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">Subscription</h2>
        <p className="text-sm text-ink/60">Upgrade paket untuk fitur tambahan.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <PricingCard title="FREE" price="Rp 0" features={["1 invitation", "Basic theme", "Watermark"]} />
        <PricingCard
          title="PREMIUM"
          price="Rp 149k"
          features={["Premium themes", "Digital gift", "No watermark", "Analytics"]}
          highlight
        />
        <PricingCard title="BUSINESS" price="Rp 399k" features={["Multi invitations", "White label", "Custom domain"]} />
      </div>
    </div>
  );
}
