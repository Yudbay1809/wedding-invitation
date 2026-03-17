import Link from "next/link";
import { InvitationPublishToggle } from "@/components/dashboard/InvitationPublishToggle";
import { format } from "date-fns";

const statusStyles: Record<string, string> = {
  published: "bg-emerald/10 text-emerald border border-emerald/20",
  draft: "bg-amber/10 text-amber border border-amber/20",
  archived: "bg-rose-50 text-rose-600 border border-rose-200"
};

export function InvitationCard({
  id,
  title,
  slug,
  status,
  updated_at: updatedAt
}: {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at?: string | null;
}) {
  const canToggle = status !== "archived";
  const updatedLabel = updatedAt ? format(new Date(updatedAt), "dd MMM yyyy") : null;
  return (
    <div className="surface p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${statusStyles[status] ?? "text-graphite border border-black/10"}`}>
          {status}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-graphite">
        <span>/invite/{slug}</span>
        {updatedLabel ? <span>Updated {updatedLabel}</span> : null}
      </div>
      <div className="flex items-center justify-between gap-2">
        <InvitationPublishToggle
          invitationId={id}
          status={status as "draft" | "published" | "archived"}
          disabled={!canToggle}
        />
        <Link href={`/dashboard/invitations/${id}`} className="text-sm text-ocean">Edit</Link>
        <Link href={`/invite/${slug}`} className="text-sm text-graphite">Preview</Link>
      </div>
    </div>
  );
}
