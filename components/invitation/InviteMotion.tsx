"use client";

import type { ReactNode } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function InviteSection({ children }: { children: ReactNode }) {
  return <Reveal>{children}</Reveal>;
}

export function InviteStagger({ children }: { children: ReactNode }) {
  return <Stagger>{children}</Stagger>;
}

export function InviteStaggerItem({ children }: { children: ReactNode }) {
  return <StaggerItem>{children}</StaggerItem>;
}
