import { StatCard } from "@/components/ui/StatCard";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { RsvpTable } from "@/components/dashboard/RsvpTable";

export default async function RsvpManagementPage({
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

  let rsvpQuery = supabase
    .from("rsvps")
    .select("name, guest_count, status, created_at")
    .in("invitation_id", invitationIds.length ? invitationIds : [""])
    .order("created_at", { ascending: false })
    .limit(25);

  if (statusFilter !== "all") {
    rsvpQuery = rsvpQuery.eq("status", statusFilter);
  }

  const { data: rsvps } = await rsvpQuery;

  const { count: totalRsvp } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const { count: attending } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("status", "attending")
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const { count: declined } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("status", "declined")
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const { count: pending } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">RSVP Management</h2>
        <p className="text-sm text-ink/60">Pantau status kehadiran tamu.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Total RSVP" value={`${totalRsvp ?? 0}`} />
        <StatCard label="Attending" value={`${attending ?? 0}`} />
        <StatCard label="Declined" value={`${declined ?? 0}`} />
        <StatCard label="Pending" value={`${pending ?? 0}`} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/rsvp" className={statusFilter === "all" ? "text-ink font-semibold" : "text-graphite"}>
          Semua
        </Link>
        <span className="text-graphite/40">|</span>
        <Link href="/dashboard/rsvp?status=attending" className={statusFilter === "attending" ? "text-ink font-semibold" : "text-graphite"}>
          Attending
        </Link>
        <span className="text-graphite/40">|</span>
        <Link href="/dashboard/rsvp?status=declined" className={statusFilter === "declined" ? "text-ink font-semibold" : "text-graphite"}>
          Declined
        </Link>
        <span className="text-graphite/40">|</span>
        <Link href="/dashboard/rsvp?status=pending" className={statusFilter === "pending" ? "text-ink font-semibold" : "text-graphite"}>
          Pending
        </Link>
      </div>
      {rsvps && rsvps.length > 0 ? (
        <RsvpTable rows={rsvps} />
      ) : (
        <EmptyState
          title="Belum ada RSVP"
          description="RSVP akan muncul setelah tamu mengisi konfirmasi kehadiran."
          actionLabel="Lihat Undangan"
          actionHref="/dashboard/invitations"
        />
      )}
    </div>
  );
}
