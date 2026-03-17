"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

const bars = Array.from({ length: 18 });

export function MusicPlayer({ src }: { src?: string | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    if (!src) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    const playOnLoad = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };
    playOnLoad();
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!src) return null;

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      await audio.play();
      setPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <audio ref={audioRef} src={src} loop />
      <motion.div
        className="rounded-3xl bg-white/90 backdrop-blur border border-black/10 px-4 py-3 shadow-lift flex items-center gap-3"
        animate={{ y: playing ? -2 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button
          onClick={toggle}
          className="rounded-full bg-white border border-black/10 p-2"
          aria-label="Toggle music"
          whileTap={{ scale: 0.92 }}
          animate={{ scale: playing ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </motion.button>
        <div className="flex items-end gap-1 h-6">
          {bars.map((_, index) => (
            <span
              key={index}
              className={`w-1 rounded-full bg-ink ${playing ? "wave-bar" : "h-2"}`}
              style={{ animationDelay: `${index * 0.08}s` }}
            />
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
        />
      </motion.div>
    </div>
  );
}
