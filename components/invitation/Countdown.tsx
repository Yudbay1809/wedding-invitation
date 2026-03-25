"use client";

import { useEffect, useMemo, useState } from "react";

export function Countdown({ date }: { date?: string | null }) {
  const target = useMemo(() => (date ? new Date(date) : null), [date]);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!target || Number.isNaN(target.getTime())) return;

    const tick = () => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;
      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
      const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
      const seconds = Math.max(0, Math.floor((diff / 1000) % 60));
      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (!timeLeft) return null;

  return (
    <div className="grid grid-cols-4 gap-3 countdown-grid">
      {[
        { label: "Hari", value: timeLeft.days },
        { label: "Jam", value: timeLeft.hours },
        { label: "Menit", value: timeLeft.minutes },
        { label: "Detik", value: timeLeft.seconds }
      ].map((item) => (
        <div key={item.label} className="surface p-3 text-center countdown-tile">
          <p className="text-[22px] md:text-2xl font-semibold countdown-value">{item.value}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-graphite countdown-label">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
