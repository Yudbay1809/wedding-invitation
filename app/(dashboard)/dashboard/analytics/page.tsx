import { AnalyticsChart } from "@/components/ui/AnalyticsChart";
import { StatCard } from "@/components/ui/StatCard";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscription";
import { PLAN_FEATURES } from "@/lib/plans";
import { format, startOfDay, subDays } from "date-fns";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function AnalyticsPage() {
  const supabase = await createServerSupabase();
  const { plan } = await getUserPlan();

  if (!PLAN_FEATURES[plan].analytics) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold">Analytics</h2>
        <p className="text-sm text-ink/60">Upgrade ke paket Premium untuk membuka analytics.</p>
      </div>
    );
  }

  const { data: userData } = await supabase.auth.getUser();
  const { data: invitations } = await supabase
    .from("invitations")
    .select("id")
    .eq("user_id", userData.user?.id ?? "");

  const invitationIds = (invitations ?? []).map((item) => item.id);
  const hasInvitations = invitationIds.length > 0;

  if (!hasInvitations) {
    return (
      <EmptyState
        title="Analytics belum tersedia"
        description="Buat undangan dan bagikan link untuk mulai mengumpulkan data."
        actionLabel="Buat Undangan"
        actionHref="/dashboard/create"
      />
    );
  }

  const { count: viewCount } = await supabase
    .from("invitation_views")
    .select("*", { count: "exact", head: true })
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const { count: rsvpCount } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const { count: messageCount } = await supabase
    .from("guest_messages")
    .select("*", { count: "exact", head: true })
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const { count: giftCount } = await supabase
    .from("gift_confirmations")
    .select("*", { count: "exact", head: true })
    .in("invitation_id", invitationIds.length ? invitationIds : [""]);

  const rsvpConversion = viewCount ? Math.round(((rsvpCount ?? 0) / viewCount) * 100) : 0;

  const startDate = startOfDay(subDays(new Date(), 6));
  const dayBuckets = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index);
    const key = format(date, "yyyy-MM-dd");
    return { key, label: format(date, "dd/MM"), views: 0, rsvps: 0, messages: 0 };
  });

  const { data: viewRows } = await supabase
    .from("invitation_views")
    .select("viewed_at")
    .in("invitation_id", invitationIds.length ? invitationIds : [""])
    .gte("viewed_at", startDate.toISOString());

  (viewRows ?? []).forEach((row) => {
    const key = format(new Date(row.viewed_at), "yyyy-MM-dd");
    const bucket = dayBuckets.find((item) => item.key === key);
    if (bucket) bucket.views += 1;
  });

  const { data: rsvpRows } = await supabase
    .from("rsvps")
    .select("created_at")
    .in("invitation_id", invitationIds.length ? invitationIds : [""])
    .gte("created_at", startDate.toISOString());

  (rsvpRows ?? []).forEach((row) => {
    const key = format(new Date(row.created_at), "yyyy-MM-dd");
    const bucket = dayBuckets.find((item) => item.key === key);
    if (bucket) bucket.rsvps += 1;
  });

  const { data: messageRows } = await supabase
    .from("guest_messages")
    .select("created_at")
    .in("invitation_id", invitationIds.length ? invitationIds : [""])
    .gte("created_at", startDate.toISOString());

  (messageRows ?? []).forEach((row) => {
    const key = format(new Date(row.created_at), "yyyy-MM-dd");
    const bucket = dayBuckets.find((item) => item.key === key);
    if (bucket) bucket.messages += 1;
  });

  const hasAnyTrend = dayBuckets.some((bucket) => bucket.views + bucket.rsvps + bucket.messages > 0);

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Invitation Views" value={`${viewCount ?? 0}`} />
        <StatCard label="RSVP Conversion" value={`${rsvpConversion}%`} />
        <StatCard label="Message Count" value={`${messageCount ?? 0}`} />
        <StatCard label="Gift Confirmations" value={`${giftCount ?? 0}`} />
      </div>
      {!hasAnyTrend ? (
        <div className="surface p-6">
          <h3 className="text-lg font-semibold">Belum ada aktivitas</h3>
          <p className="text-sm text-graphite mt-2">Bagikan link undangan untuk mulai melihat tren views, RSVP, dan ucapan.</p>
        </div>
      ) : null}
      <div className="grid lg:grid-cols-3 gap-6">
        <AnalyticsChart
          title="Views 7 Hari Terakhir"
          data={dayBuckets.map(({ label, views }) => ({ label, value: views }))}
        />
        <AnalyticsChart
          title="RSVP 7 Hari Terakhir"
          data={dayBuckets.map(({ label, rsvps }) => ({ label, value: rsvps }))}
        />
        <AnalyticsChart
          title="Messages 7 Hari Terakhir"
          data={dayBuckets.map(({ label, messages }) => ({ label, value: messages }))}
        />
      </div>
    </div>
  );
}
