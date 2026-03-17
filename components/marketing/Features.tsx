"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Features() {
  const items = [
    { title: "Builder elegan", desc: "Susun undangan dengan struktur yang siap tampil mewah." },
    { title: "RSVP terpusat", desc: "Pantau konfirmasi hadir dengan data yang rapi dan real-time." },
    { title: "Amplop digital", desc: "Terima hadiah dengan konfirmasi dan catatan otomatis." },
    { title: "Tema premium", desc: "Pilih gaya visual yang sesuai konsep acara." },
    { title: "Multi undangan", desc: "Kelola beberapa acara dalam satu akun." },
    { title: "Insight tamu", desc: "Lihat performa undangan dan engagement tamu." }
  ];

  return (
    <section id="features" className="py-16">
      <Reveal>
        <div className="flex flex-col gap-4">
          <span className="pill">Product Features</span>
          <h2 className="section-title">Dirancang untuk pengalaman tamu yang berkelas</h2>
          <p className="muted">Semua flow yang kamu butuhkan untuk membuat undangan digital yang terasa premium dan rapi.</p>
        </div>
      </Reveal>
      <Stagger>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <div className="surface p-6 hover-lift">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-graphite mt-2">{item.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
