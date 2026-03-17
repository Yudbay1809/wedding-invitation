import { DataTable } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function RsvpManagementPage() {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();

  const { data: invitations } = await supabase
    .from("invitations")
    .select("id")
    .eq("user_id", userData.user?.id ?? "");

  const invitationIds = (invitations ?? []).map((item) => item.id);

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("name, guest_count, status, created_at")
    .in("invitation_id", invitationIds.length ? invitationIds : [""])
    .eq("status", "attending")
    .order("created_at", { ascending: false })
    .limit(25);

  const { count: attending } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("status", "attending")
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const rows = (rsvps ?? []).map((rsvp) => [
    rsvp.name,
    String(rsvp.guest_count ?? 0),
    new Date(rsvp.created_at).toLocaleDateString("id-ID")
  ]);

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 gap-4">
        <StatCard label="Total Hadir" value={`${attending ?? 0}`} />
        <StatCard label="Tamu Datang (Terbaru)" value={`${rsvps?.length ?? 0}`} />
      </div>
      <DataTable headers={["Name", "Guests", "Date"]} rows={rows} />
    </div>
  );
}
