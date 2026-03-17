"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function EnvelopeReveal({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-sand/90 backdrop-blur-sm"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <div className="envelope-shell">
            <motion.div
              className="envelope-letter"
              initial={{ y: 40 }}
              animate={{ y: -10 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-graphite">Wedding Invitation</p>
              <h3 className="text-xl font-semibold mt-2 text-ink">{title ?? "The Wedding"}</h3>
              <p className="text-sm text-graphite mt-1">{subtitle ?? "Save the Date"}</p>
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
