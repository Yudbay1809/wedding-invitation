"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function GalleryLightbox({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? images[activeIndex] : null;

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length]);

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
      if (event.key === "ArrowLeft") {
        goPrev();
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, goNext, goPrev]);

  return (
    <>
      {active ? (
        <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center">
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-6 right-6 text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={goPrev}
            className="absolute left-6 text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-6 text-white"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="max-w-4xl w-[90%] h-[80%] bg-black rounded-3xl overflow-hidden">
            <div
              className="w-full h-full bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${active})` }}
            />
          </div>
        </div>
      ) : null}
      <div className="columns-2 md:columns-3 gap-4 mt-6">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className="mb-4 break-inside-avoid rounded-2xl overflow-hidden hover:opacity-90 transition"
          >
            <div className="h-40 md:h-56 bg-[#f3f4f6]" style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          </button>
        ))}
      </div>
    </>
  );
}
