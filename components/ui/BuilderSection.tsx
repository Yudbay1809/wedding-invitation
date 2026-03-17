import type { ReactNode } from "react";

export function BuilderSection({
  id,
  title,
  description,
  children
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="surface p-6 flex flex-col gap-4 scroll-mt-28">
      <div>
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        {description ? <p className="text-sm text-graphite">{description}</p> : null}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}
