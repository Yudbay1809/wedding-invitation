"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

const templates = [
  { id: "classic", label: "Classic Elegant", src: "/assets/template-classic.svg", preview: "/invite/demo-classic" },
  { id: "minimal", label: "Minimal Modern", src: "/assets/template-minimal.svg", preview: "/invite/demo-minimal" },
  { id: "romantic", label: "Romantic Floral", src: "/assets/template-romantic.svg", preview: "/invite/demo-romantic" },
  { id: "luxury", label: "Luxury Gold", src: "/assets/template-luxury.svg", preview: "/invite/demo-luxury" },
  { id: "boho", label: "Boho Sunset", src: "/assets/template-boho.svg", preview: "/invite/demo-boho" },
  { id: "garden", label: "Garden Vows", src: "/assets/template-garden.svg", preview: "/invite/demo-garden" },
  { id: "modern", label: "Modern Noir", src: "/assets/template-modern.svg", preview: "/invite/demo-modern" },
  { id: "celestial", label: "Celestial Night", src: "/assets/template-celestial.svg", preview: "/invite/demo-celestial" }
];

export function TemplateShowcase() {
  return (
    <section id="templates" className="py-16">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="pill">Templates</span>
            <h2 className="section-title mt-4">Kurasi tema untuk setiap mood</h2>
            <p className="muted mt-2">Classic, Minimal, Romantic, Luxury. Semua siap di-custom sesuai brand kamu.</p>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-graphite">Classic - Minimal - Romantic - Luxury - Boho - Garden - Modern - Celestial</span>
        </div>
      </Reveal>
      <Stagger>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {templates.map((template) => (
            <StaggerItem key={template.id}>
              <Link href={template.preview} className="group">
                <div className="surface p-4 hover-lift">
                  <div className="relative">
                    <Image src={template.src} alt={template.label} width={1200} height={720} className="rounded-2xl" />
                    <div className="absolute inset-0 rounded-2xl bg-black/0 transition group-hover:bg-black/10" />
                    <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-ink shadow-soft opacity-0 transition group-hover:opacity-100">
                      Preview
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">{template.label}</p>
                    <span className="text-xs text-emerald">Preview</span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
