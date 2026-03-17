"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Testimonials() {
  const list = [
    { name: "Tara & Reza", quote: "RSVP jadi rapi dan tamu langsung bisa kirim ucapan." },
    { name: "Nadia & Irfan", quote: "Tema undangannya elegan dan gampang diubah." },
    { name: "Amelia & Fajar", quote: "Analytics membantu kami estimasi jumlah tamu." }
  ];

  return (
    <section className="py-16">
      <Reveal>
        <span className="pill">Testimonials</span>
        <h2 className="section-title mt-4">Pasangan yang sudah percaya</h2>
      </Reveal>
      <Stagger>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {list.map((item) => (
            <StaggerItem key={item.name}>
              <div className="surface p-6 hover-lift">
                <p className="text-sm text-graphite">"{item.quote}"</p>
                <p className="text-sm font-semibold mt-4">{item.name}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
