import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { GuestMessagesBulkTable } from "@/components/dashboard/GuestMessagesBulkTable";

export default async function GuestMessagesPage({
  searchParams
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const statusFilter = resolvedSearchParams?.status ?? "all";

  const { data: invitations } = await supabase
    .from("invitations")
    .select("id")
    .eq("user_id", userData.user?.id ?? "");

  const invitationIds = (invitations ?? []).map((item) => item.id);

  let query = supabase
    .from("guest_messages")
    .select("id, name, message, is_hidden")
    .in("invitation_id", invitationIds.length ? invitationIds : [""])
    .order("created_at", { ascending: false })
    .limit(25);

  if (statusFilter === "hidden") {
    query = query.eq("is_hidden", true);
  }
  if (statusFilter === "visible") {
    query = query.eq("is_hidden", false);
  }

  const { data: messages } = await query;

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">Guest Messages</h2>
        <p className="text-sm text-ink/60">Moderasi ucapan tamu.</p>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/messages" className={statusFilter === "all" ? "text-ink font-semibold" : "text-graphite"}>
          Semua
        </Link>
        <span className="text-graphite/40">|</span>
        <Link href="/dashboard/messages?status=visible" className={statusFilter === "visible" ? "text-ink font-semibold" : "text-graphite"}>
          Visible
        </Link>
        <span className="text-graphite/40">|</span>
        <Link href="/dashboard/messages?status=hidden" className={statusFilter === "hidden" ? "text-ink font-semibold" : "text-graphite"}>
          Hidden
        </Link>
      </div>
      <GuestMessagesBulkTable messages={messages ?? []} />
    </div>
  );
}
