"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function Footer() {
  return (
    <footer className="py-12 border-t border-black/5">
      <Reveal>
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold">WedSaaS</h3>
            <p className="text-sm text-graphite mt-2">Platform undangan digital premium untuk pengalaman tamu yang hangat.</p>
          </div>
          <div className="flex gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-graphite">
            <Link href="/register">Coba Gratis</Link>
            <Link href="/login">Masuk</Link>
            <a href="#pricing">Pricing</a>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
