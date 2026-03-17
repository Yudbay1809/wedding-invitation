"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function RsvpAnalyticsShowcase() {
  return (
    <section className="py-16">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <Reveal>
          <div>
            <span className="pill">RSVP & Analytics</span>
            <h2 className="section-title mt-4">Data tamu yang rapi dan siap action</h2>
            <p className="muted mt-3">Pantau jumlah tamu, konversi RSVP, ucapan, serta gift confirmation di satu dashboard.</p>
          </div>
        </Reveal>
        <Stagger>
          <div className="surface p-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "RSVP masuk", value: "128", bg: "bg-[#ffe4e6]" },
                { label: "Hadir", value: "96", bg: "bg-[#e0f2fe]" },
                { label: "Ucapan", value: "64", bg: "bg-[#fef3c7]" },
                { label: "Views", value: "2.4k", bg: "bg-[#ecfccb]" }
              ].map((item) => (
                <StaggerItem key={item.label}>
                  <div className={`rounded-2xl ${item.bg} p-4 hover-lift`}>
                    <p className="text-sm text-graphite">{item.label}</p>
                    <p className="text-2xl font-semibold">{item.value}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </div>
        </Stagger>
      </div>
    </section>
  );
}
