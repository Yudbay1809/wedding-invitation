import { clsx } from "clsx";

export function StatCard({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className={clsx("surface p-5 flex flex-col gap-3")}> 
      <span className="text-xs uppercase tracking-[0.2em] text-graphite">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-semibold text-ink">{value}</span>
        {trend ? <span className="text-sm text-moss">{trend}</span> : null}
      </div>
    </div>
  );
}
