import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-sand">
      <div className="hidden md:flex flex-col justify-between p-12 gradient-hero">
        <Link href="/" className="text-xl font-semibold">WedSaaS</Link>
        <div>
          <h2 className="text-3xl font-semibold">Selamat datang kembali</h2>
          <p className="text-sm text-graphite mt-2">Kelola undangan dan data tamu dengan mudah.</p>
        </div>
        <div className="surface p-6">
          <p className="text-sm text-graphite">&ldquo;Pengalaman digitalnya rapi dan elegan. Tamu merasa diperhatikan.&rdquo;</p>
          <p className="text-xs uppercase tracking-[0.2em] text-graphite mt-4">Nadia & Irfan</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
