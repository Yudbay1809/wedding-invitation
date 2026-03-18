"use client";

import Link from "next/link";
import { Button } from "../ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";

export function Hero() {
  return (
    <section className="grid lg:grid-cols-2 gap-12 items-center py-16">
      <Reveal>
        <div className="flex flex-col gap-6">
          <span className="pill">SaaS Undangan Digital</span>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-xl">
            Undangan pernikahan digital yang terasa sekelas brand hospitality premium.
          </h1>
          <p className="text-lg text-graphite max-w-xl">
            Bangun pengalaman tamu yang rapi, personal, dan penuh nuansa. Kelola RSVP, ucapan, amplop digital, dan analytics dengan workflow yang elegan.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register">
              <Button>Coba Gratis</Button>
            </Link>
            <Link href="/invite/demo-romantic">
              <Button variant="secondary">Lihat Demo</Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-graphite">
            <span className="chip">Multi-invitation</span>
            <span className="chip">Mobile-first</span>
            <span className="chip">Analytics real-time</span>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="surface p-4 hover-lift">
          <div className="relative h-[380px] w-full overflow-hidden rounded-3xl">
            <Image
              src="/assets/hero-photo.jpg"
              alt="Wedding invitation flat lay"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Signature Theme</p>
              <h3 className="text-2xl font-semibold mt-2">Raisa & Dimas</h3>
              <p className="text-sm text-white/70">21 Juni 2026 - Jakarta</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
