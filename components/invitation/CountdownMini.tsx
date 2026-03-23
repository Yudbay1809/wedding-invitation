"use client";

import { useEffect, useMemo, useState } from "react";

export function CountdownMini({ date }: { date?: string | null }) {
  const target = useMemo(() => (date ? new Date(date) : null), [date]);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);

  useEffect(() => {
    if (!target || Number.isNaN(target.getTime())) return;

    const tick = () => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;
      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
      const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
      setTimeLeft({ days, hours, minutes });
    };

    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, [target]);

  if (!timeLeft) return null;

  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Hari", value: timeLeft.days },
        { label: "Jam", value: timeLeft.hours },
        { label: "Menit", value: timeLeft.minutes }
      ].map((item) => (
        <div key={item.label} className="mini-countdown">
          <p className="text-lg font-semibold">{item.value}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-graphite">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
