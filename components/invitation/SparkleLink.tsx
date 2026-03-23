"use client";

import { useState } from "react";
import { clsx } from "clsx";

const particles = Array.from({ length: 10 }).map((_, index) => ({
  angle: `${(360 / 10) * index}deg`,
  distance: `${26 + (index % 4) * 6}px`
}));

export function SparkleLink({
  href,
  className,
  children,
  shimmer = false
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  shimmer?: boolean;
}) {
  const [burstId, setBurstId] = useState(0);

  return (
    <a
      href={href}
      className={clsx("relative overflow-visible", shimmer ? "cta-shimmer" : null, className)}
      onClick={() => setBurstId((value) => value + 1)}
    >
      {children}
      {shimmer ? <span className="cta-shimmer-layer" aria-hidden="true" /> : null}
      <span key={burstId} className="sparkle-burst">
        {particles.map((particle, index) => (
          <span
            key={index}
            className="sparkle-dot"
            style={{ ["--angle" as string]: particle.angle, ["--distance" as string]: particle.distance }}
          />
        ))}
      </span>
    </a>
  );
}
