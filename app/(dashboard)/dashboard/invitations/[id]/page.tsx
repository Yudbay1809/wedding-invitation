import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createServerSupabase } from "@/lib/supabase/server";
import { archiveInvitation, duplicateInvitation } from "@/app/actions/invitations";
import { InvitationPublishToggle } from "@/components/dashboard/InvitationPublishToggle";

const statusStyles: Record<string, string> = {
  published: "bg-emerald/10 text-emerald border border-emerald/20",
  draft: "bg-amber/10 text-amber border border-amber/20",
  archived: "bg-rose-50 text-rose-600 border border-rose-200"
};

export default async function InvitationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const resolvedParams = await params;
  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, title, slug, status")
    .eq("id", resolvedParams.id)
    .single();
  const canToggle = invitation?.status !== "archived";

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Invitation Detail</h2>
          <p className="text-sm text-ink/60">Edit dan kelola undangan.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${statusStyles[invitation?.status ?? "draft"] ?? "text-graphite border border-black/10"}`}>
            {invitation?.status ?? "draft"}
          </span>
          <InvitationPublishToggle
            invitationId={resolvedParams.id}
            status={(invitation?.status ?? "draft") as "draft" | "published" | "archived"}
            disabled={!canToggle}
          />
          <Link href={`/invite/${invitation?.slug ?? ""}`}>
            <Button variant="secondary">Preview</Button>
          </Link>
        </div>
      </div>
      <div className="card p-6">
        <p className="text-sm text-ink/60">ID: {resolvedParams.id}</p>
        <p className="text-lg font-semibold mt-2">{invitation?.title ?? "Untitled"}</p>
        <div className="mt-4 flex gap-3">
          <Link href={`/dashboard/invitations/${resolvedParams.id}/builder`} className="text-sm text-emerald">Open Builder</Link>
          <form action={duplicateInvitation.bind(null, resolvedParams.id)}>
            <button className="text-sm text-ink/60">Duplicate</button>
          </form>
          <form action={archiveInvitation.bind(null, resolvedParams.id)}>
            <button className="text-sm text-ink/60">Archive</button>
          </form>
        </div>
      </div>
    </div>
  );
}
