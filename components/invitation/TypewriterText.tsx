"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

export function TypewriterText({
  text,
  speed = 45,
  delay = 400,
  className
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const hasOpenedRef = useRef(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisibleRef.current = true;
          observer.disconnect();
          if (hasOpenedRef.current) {
            setStarted(true);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onOpened = () => {
      hasOpenedRef.current = true;
      if (!started && isVisibleRef.current) {
        setStarted(true);
      }
    };

    window.addEventListener("invite:opened", onOpened);
    return () => window.removeEventListener("invite:opened", onOpened);
  }, [started]);

  useEffect(() => {
    if (!started) return;
    setDisplayed("");
    let index = 0;
    const startTimer = setTimeout(() => {
      const timer = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(timer);
        }
      }, speed);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [text, speed, delay, started]);

  return (
    <p ref={containerRef} className={clsx("typewriter", className)}>
      {displayed}
      <span className="typewriter-cursor" />
    </p>
  );
}
