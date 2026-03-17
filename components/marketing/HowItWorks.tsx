"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function HowItWorks() {
  const steps = [
    { title: "Pilih vibe", desc: "Tentukan tema dan gaya yang paling cocok dengan acara." },
    { title: "Isi detail", desc: "Lengkapi data pasangan, jadwal, galeri, dan pesan." },
    { title: "Bagikan link", desc: "Kirim ke tamu dan pantau RSVP secara real-time." }
  ];

  return (
    <section className="py-16">
      <Reveal>
        <div className="flex items-center justify-between">
          <div>
            <span className="pill">How It Works</span>
            <h2 className="section-title mt-4">Flow yang sederhana, hasil yang premium</h2>
          </div>
        </div>
      </Reveal>
      <Stagger>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {steps.map((step, index) => (
            <StaggerItem key={step.title}>
              <div className="surface p-6 hover-lift">
                <p className="text-xs uppercase tracking-[0.2em] text-graphite">Step {index + 1}</p>
                <h3 className="text-lg font-semibold mt-3">{step.title}</h3>
                <p className="text-sm text-graphite mt-2">{step.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
