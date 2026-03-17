"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Faq() {
  const faqs = [
    { q: "Apakah bisa custom domain?", a: "Tersedia di paket Business sebagai placeholder custom domain." },
    { q: "Berapa banyak undangan bisa dibuat?", a: "Tergantung paket, Business mendukung multi-undangan." },
    { q: "Apakah ada watermark?", a: "Watermark hanya di paket Free." }
  ];

  return (
    <section id="faq" className="py-16">
      <Reveal>
        <span className="pill">FAQ</span>
        <h2 className="section-title mt-4">Jawaban untuk pertanyaan populer</h2>
      </Reveal>
      <Stagger>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {faqs.map((item) => (
            <StaggerItem key={item.q}>
              <div className="surface p-6 hover-lift">
                <h3 className="text-lg font-semibold">{item.q}</h3>
                <p className="text-sm text-graphite mt-2">{item.a}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
