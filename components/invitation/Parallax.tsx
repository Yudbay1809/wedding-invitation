"use client";

import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Parallax({ children, strength = 40 }: { children: ReactNode; strength?: number }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, strength]);

  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  );
}
