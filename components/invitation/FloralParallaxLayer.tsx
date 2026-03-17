"use client";

import { Parallax } from "@/components/invitation/Parallax";

export function FloralParallaxLayer() {
  return (
    <Parallax strength={18}>
      <div className="romantic-ornament absolute top-10 right-10 h-48 w-48 opacity-60" />
    </Parallax>
  );
}
