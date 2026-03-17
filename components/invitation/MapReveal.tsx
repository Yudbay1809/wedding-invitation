"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export function MapReveal({ link }: { link: string }) {
  return (
    <a href={link} target="_blank" rel="noreferrer" className="block">
      <div className="relative h-56 rounded-3xl bg-cloud border border-black/10 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-6 -translate-x-1/2 flex flex-col items-center"
          initial={{ y: -24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="rounded-full bg-white shadow-soft p-2">
            <MapPin className="h-5 w-5 text-rose-500" />
          </div>
          <span className="mt-2 text-xs text-graphite">Buka Maps</span>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent" />
      </div>
    </a>
  );
}
