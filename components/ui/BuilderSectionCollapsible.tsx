"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function BuilderSectionCollapsible({
  id,
  title,
  description,
  children,
  defaultOpen = true
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section id={id} className="surface p-6 flex flex-col gap-4 scroll-mt-28">
      <button
        type="button"
        className="flex items-start justify-between gap-4 text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          {description ? <p className="text-sm text-graphite">{description}</p> : null}
        </div>
        <ChevronDown className={`h-5 w-5 text-graphite transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="grid gap-4">{children}</div> : null}
    </section>
  );
}
