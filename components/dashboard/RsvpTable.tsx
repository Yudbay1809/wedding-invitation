import { format } from "date-fns";

const statusStyles: Record<string, string> = {
  attending: "bg-emerald/10 text-emerald border border-emerald/20",
  declined: "bg-rose-50 text-rose-600 border border-rose-200",
  pending: "bg-amber/10 text-amber border border-amber/20"
};

export function RsvpTable({
  rows
}: {
  rows: Array<{ name: string | null; guest_count: number | null; status: string | null; created_at: string }>;
}) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-sand text-graphite">
          <tr>
            <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Name</th>
            <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Guests</th>
            <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Status</th>
            <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((rsvp, index) => (
            <tr key={`${rsvp.name}-${rsvp.created_at}-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-cloud"}>
              <td className="px-4 py-3 text-graphite">{rsvp.name ?? "Guest"}</td>
              <td className="px-4 py-3 text-graphite">{String(rsvp.guest_count ?? 0)}</td>
              <td className="px-4 py-3 text-graphite">
                <span className={`text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${statusStyles[rsvp.status ?? "pending"] ?? "border border-black/10 text-graphite"}`}>
                  {rsvp.status ?? "pending"}
                </span>
              </td>
              <td className="px-4 py-3 text-graphite">
                {format(new Date(rsvp.created_at), "dd MMM yyyy")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
