import { ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";

export function AuthSidePanel({
  title,
  subtitle,
  highlight
}: {
  title: string;
  subtitle: string;
  highlight: string;
}) {
  return (
    <div className="surface p-8 h-full flex flex-col justify-between gap-6">
      <div>
        <span className="pill">WedSaaS</span>
        <h2 className="text-2xl font-semibold mt-4">{title}</h2>
        <p className="text-sm text-graphite mt-2">{subtitle}</p>
        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber" />
            <span>Template premium dan personalisasi lengkap.</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-coral" />
            <span>RSVP, ucapan, dan amplop digital terintegrasi.</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald" />
            <span>Data aman dan akses undangan terkontrol.</span>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-sand p-4 text-sm text-graphite">
        <p className="font-semibold text-ink">"{highlight}"</p>
        <p className="mt-2 text-xs">— Amelia & Fajar</p>
      </div>
    </div>
  );
}