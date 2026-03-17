"use client";

import { PricingCard } from "../ui/PricingCard";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Pricing() {
  return (
    <section id="pricing" className="py-16">
      <Reveal>
        <span className="pill">Pricing</span>
        <h2 className="section-title mt-4">Paket fleksibel untuk setiap kebutuhan</h2>
        <p className="muted mt-3">Mulai gratis, upgrade ketika butuh fitur premium.</p>
      </Reveal>
      <Stagger>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            <PricingCard key="free" title="FREE" price="Rp 0" features={["1 invitation", "Basic theme", "Watermark"]} />,
            <PricingCard
              key="premium"
              title="PREMIUM"
              price="Rp 149k"
              features={["Premium themes", "Digital gift", "No watermark", "Analytics"]}
              highlight
            />,
            <PricingCard key="business" title="BUSINESS" price="Rp 399k" features={["Multi invitations", "White label", "Custom domain"]} />
          ].map((card, index) => (
            <StaggerItem key={index}>{card}</StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
