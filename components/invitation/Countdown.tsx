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
    <div className="countdown-shell">
      <div className="countdown-card">
        <p className="countdown-title">Countdown</p>
        <div className="grid grid-cols-3 gap-3 countdown-grid">
          {[
            { label: "Hari", value: timeLeft.days },
            { label: "Jam", value: timeLeft.hours },
            { label: "Menit", value: timeLeft.minutes }
          ].map((item) => (
            <div key={item.label} className="countdown-pill">
              <p className="text-[20px] md:text-[22px] font-semibold countdown-value">{item.value}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-graphite countdown-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
