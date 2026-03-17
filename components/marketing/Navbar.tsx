"use client";

import Link from "next/link";
import { Button } from "../ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mt-6 flex items-center justify-between rounded-full bg-white/80 px-6 py-4 shadow-soft backdrop-blur">
            <Link href="/" className="text-lg font-semibold tracking-tight">WedSaaS</Link>
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-graphite">
              <a href="#features">Features</a>
              <a href="#templates">Templates</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button>Coba Gratis</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </nav>
  );
}
