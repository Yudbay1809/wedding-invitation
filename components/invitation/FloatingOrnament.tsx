"use client";

import { motion } from "framer-motion";

export function FloatingOrnament({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`romantic-ornament ${className}`}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
