import { StatCard } from "@/components/ui/StatCard";
import { AnalyticsChart } from "@/components/ui/AnalyticsChart";
import { createServerSupabase } from "@/lib/supabase/server";
import { format, startOfDay, subDays } from "date-fns";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function DashboardOverviewPage() {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();

  const { data: invitations, count: invitationCount } = await supabase
    .from("invitations")
    .select("id", { count: "exact" })
    .eq("user_id", userData.user?.id ?? "");

  const invitationIds = (invitations ?? []).map((item) => item.id);

  const { count: rsvpCount } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const { count: messageCount } = await supabase
    .from("guest_messages")
    .select("*", { count: "exact", head: true })
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const { count: viewCount } = await supabase
    .from("invitation_views")
    .select("*", { count: "exact", head: true })
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const { count: attendingCount } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("status", "attending")
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const attendanceRate = rsvpCount ? Math.round(((attendingCount ?? 0) / rsvpCount) * 100) : 0;

  const startDate = startOfDay(subDays(new Date(), 6));
  const { data: viewRows } = await supabase
    .from("invitation_views")
    .select("viewed_at")
    .in("invitation_id", invitationIds.length ? invitationIds : [""])
    .gte("viewed_at", startDate.toISOString());

  const dayBuckets = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index);
    const key = format(date, "yyyy-MM-dd");
    return { key, label: format(date, "dd/MM"), value: 0 };
  });

  (viewRows ?? []).forEach((row) => {
    const key = format(new Date(row.viewed_at), "yyyy-MM-dd");
    const bucket = dayBuckets.find((item) => item.key === key);
    if (bucket) bucket.value += 1;
  });

  const hasInvitations = (invitationCount ?? 0) > 0;
  const hasViews = dayBuckets.some((bucket) => bucket.value > 0);

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard label="Total Invitations" value={`${invitationCount ?? 0}`} />
        <StatCard label="Total RSVP" value={`${rsvpCount ?? 0}`} />
        <StatCard label="Guest Messages" value={`${messageCount ?? 0}`} />
        <StatCard label="Invitation Views" value={`${viewCount ?? 0}`} />
        <StatCard label="Attendance Rate" value={`${attendanceRate}%`} />
      </div>
      {!hasInvitations ? (
        <EmptyState
          title="Mulai dari undangan pertama"
          description="Dashboard akan terisi setelah kamu membuat dan membagikan undangan."
          actionLabel="Buat Undangan"
          actionHref="/dashboard/create"
        />
      ) : (
        <>
          <AnalyticsChart title="Views 7 Hari Terakhir" data={dayBuckets.map(({ label, value }) => ({ label, value }))} />
          {!hasViews ? (
            <p className="text-sm text-graphite">Belum ada view dalam 7 hari terakhir. Bagikan link undangan untuk mulai tracking.</p>
          ) : null}
        </>
      )}
      <div className="surface p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold">What’s next</h3>
            <p className="text-sm text-graphite">Tiga langkah cepat untuk undangan pertama kamu.</p>
            <ol className="mt-4 grid gap-2 text-sm text-ink/70">
              <li>1. Buat undangan baru dengan tema yang sesuai.</li>
              <li>2. Lengkapi info pasangan, acara, dan galeri.</li>
              <li>3. Publish & bagikan link ke tamu.</li>
            </ol>
          </div>
          <Link href="/dashboard/create">
            <Button>Mulai Sekarang</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
