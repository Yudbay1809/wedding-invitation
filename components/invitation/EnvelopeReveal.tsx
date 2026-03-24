"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function EnvelopeReveal({
  title,
  subtitle,
  variant = "classic"
}: {
  title?: string;
  subtitle?: string;
  variant?: "classic" | "minimal" | "romantic" | "luxury" | "boho" | "garden" | "modern" | "celestial";
}) {
  const [visible, setVisible] = useState(true);
  const isLuxury = variant === "luxury";
  const isCelestial = variant === "celestial";

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [visible]);

  useEffect(() => {
    if (visible) return;
    window.dispatchEvent(new CustomEvent("invite:opened"));
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
            isLuxury || isCelestial ? "bg-ink/90" : "bg-sand/90"
          }`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <div className={`envelope-shell envelope-${variant}`}>
            <motion.div
              className="envelope-letter"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: -10, opacity: 1 }}
              transition={{ duration: isLuxury ? 1.4 : 1.1, ease: "easeOut", delay: 0.4 }}
            >
              <p className={`text-xs uppercase tracking-[0.2em] ${isLuxury || isCelestial ? "text-white/70" : "text-graphite"}`}>
                Wedding Invitation
              </p>
              <h3 className={`text-xl font-semibold mt-2 ${isLuxury || isCelestial ? "text-white" : "text-ink"}`}>
                {title ?? "The Wedding"}
              </h3>
              <p className={`text-sm mt-1 ${isLuxury || isCelestial ? "text-white/70" : "text-graphite"}`}>
                {subtitle ?? "Save the Date"}
              </p>
            </motion.div>
            <div className="envelope-base" />
            <motion.div
              className="envelope-flap"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -140 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
