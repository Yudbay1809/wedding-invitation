"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

export function TypewriterText({
  text,
  speed = 24,
  className
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <p className={clsx("typewriter", className)}>
      {displayed}
      <span className="typewriter-cursor" />
    </p>
  );
}
