import { DataTable } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { createServerSupabase } from "@/lib/supabase/server";
import { updateTenantPlan } from "@/app/actions/admin";
import { AdminInvitationBulkTable } from "@/components/admin/AdminInvitationBulkTable";

export default async function AdminPage() {
  const supabase = await createServerSupabase();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role");

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("user_id, plan, status");

  const { data: invitations } = await supabase
    .from("invitations")
    .select("id, title, slug, status, user_id");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, user_id, invitation_id, plan, addon_theme, amount, currency, status, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: totalViews } = await supabase
    .from("invitation_views")
    .select("*", { count: "exact", head: true });

  const totalTenants = profiles?.length ?? 0;
  const totalInvitations = invitations?.length ?? 0;
  const activeInvitations = (invitations ?? []).filter((inv) => inv.status === "published").length;
  const suspendedInvitations = (invitations ?? []).filter((inv) => inv.status === "archived").length;

  const planCounts = { free: 0, premium: 0, business: 0 };
  (subscriptions ?? []).forEach((sub) => {
    if (sub.plan === "premium") planCounts.premium += 1;
    else if (sub.plan === "business") planCounts.business += 1;
    else planCounts.free += 1;
  });

  const invitationCount = new Map<string, number>();
  (invitations ?? []).forEach((invitation) => {
    invitationCount.set(invitation.user_id, (invitationCount.get(invitation.user_id) ?? 0) + 1);
  });

  const rows = (profiles ?? []).map((profile) => {
    const subscription = subscriptions?.find((item) => item.user_id === profile.id);
    return [
      profile.full_name ?? profile.id,
      String(invitationCount.get(profile.id) ?? 0),
      subscription?.status ?? "inactive",
      <form action={updateTenantPlan} key={profile.id}>
        <input type="hidden" name="user_id" value={profile.id} />
        <select name="plan" defaultValue={subscription?.plan ?? "free"} className="rounded-lg border border-black/10 px-2 py-1 text-xs">
          <option value="free">FREE</option>
          <option value="premium">PREMIUM</option>
          <option value="business">BUSINESS</option>
        </select>
        <button className="ml-2 text-xs text-emerald" type="submit">Save</button>
      </form>
    ];
  });

  const profileMap = new Map<string, string>();
  (profiles ?? []).forEach((profile) => {
    profileMap.set(profile.id, profile.full_name ?? profile.id);
  });
  const invitationMap = new Map<string, string>();
  (invitations ?? []).forEach((invitation) => {
    invitationMap.set(invitation.id, invitation.title ?? invitation.id);
  });

  const bulkRows = (invitations ?? []).map((invitation) => ({
    id: invitation.id,
    title: invitation.title,
    slug: invitation.slug,
    owner: profileMap.get(invitation.user_id) ?? invitation.user_id,
    status: invitation.status
  }));

  const transactionRows = (transactions ?? []).map((trx) => [
    profileMap.get(trx.user_id) ?? trx.user_id,
    invitationMap.get(trx.invitation_id ?? "") ?? "-",
    trx.plan ?? "-",
    trx.addon_theme ?? "none",
    `${trx.currency ?? "IDR"} ${trx.amount ?? 0}`,
    trx.status ?? "paid",
    trx.created_at ? new Date(trx.created_at).toLocaleDateString("id-ID") : "-"
  ]);

  return (
    <div className="grid gap-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <p className="text-sm text-ink/60">Ringkasan aktivitas platform & tindakan cepat.</p>
        </div>
        <a className="text-sm text-emerald" href="/admin/transactions/export">Export transaksi CSV</a>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="surface p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite">Ringkasan Supplier</h3>
            <span className="text-xs text-graphite">Bulan ini</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <StatCard label="Tenant Aktif" value={`${totalTenants}`} />
            <StatCard label="Total Undangan" value={`${totalInvitations}`} />
            <StatCard label="Views" value={`${totalViews ?? 0}`} />
          </div>
        </div>

        <div className="surface p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite">Alert Tindakan Cepat</h3>
            <a className="text-xs text-emerald" href="/admin/invitations">Lihat semua</a>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-cloud px-4 py-3">
              <div>
                <p className="font-semibold text-ink">{suspendedInvitations} undangan perlu perhatian</p>
                <p className="text-xs text-graphite">Status archived</p>
              </div>
              <a className="text-xs text-emerald" href="/admin/invitations">Buka</a>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-cloud px-4 py-3">
              <div>
                <p className="font-semibold text-ink">{planCounts.premium + planCounts.business} paket aktif</p>
                <p className="text-xs text-graphite">Premium + Business</p>
              </div>
              <a className="text-xs text-emerald" href="/admin">Detail</a>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-cloud px-4 py-3">
              <div>
                <p className="font-semibold text-ink">{activeInvitations} undangan published</p>
                <p className="text-xs text-graphite">Siap disebar</p>
              </div>
              <a className="text-xs text-emerald" href="/admin/invitations">Cek</a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="grid gap-4">
          <div className="surface p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite">Highlight Hari Ini</h3>
            <div className="mt-3 space-y-3 text-sm text-graphite">
              <div className="flex items-center justify-between rounded-2xl bg-cloud px-4 py-3">
                <span>{activeInvitations} undangan aktif</span>
                <span className="text-xs text-emerald">Stabil</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-cloud px-4 py-3">
                <span>{planCounts.free} tenant free</span>
                <span className="text-xs text-graphite">Potential upsell</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-cloud px-4 py-3">
                <span>{planCounts.business} tenant business</span>
                <span className="text-xs text-emerald">High value</span>
              </div>
            </div>
          </div>

          <div className="surface p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite">Alert Undangan Kritis</h3>
            <div className="mt-4 space-y-3 text-sm">
              {(bulkRows ?? []).slice(0, 3).map((row) => (
                <div key={row.id} className="flex items-center justify-between rounded-2xl bg-cloud px-4 py-3">
                  <div>
                    <p className="font-semibold text-ink">{row.title}</p>
                    <p className="text-xs text-graphite">{row.owner}</p>
                  </div>
                  <span className="text-xs text-amber">Perlu cek</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="surface p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite">Aktivitas Terbaru</h3>
            <div className="mt-4 space-y-3 text-sm text-graphite">
              {transactionRows.slice(0, 3).map((row, index) => (
                <div key={`${row[0]}-${index}`} className="rounded-2xl bg-cloud px-4 py-3">
                  <p className="font-semibold text-ink">{row[1]} • {row[0]}</p>
                  <p className="text-xs">{row[2]} / Add-on {row[3]} • {row[5]}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="surface p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite">Insight Singkat</h3>
            <p className="text-sm text-graphite mt-2">Trend transaksi 6 minggu terakhir (placeholder).</p>
            <div className="mt-4">
              <div className="h-32 rounded-2xl bg-cloud" />
            </div>
          </div>
        </div>
      </div>

      <div className="surface p-6">
        <h3 className="text-lg font-semibold">Tenant Overview</h3>
        <p className="text-sm text-ink/60">Status plan dan jumlah undangan.</p>
        <div className="mt-4">
          <DataTable headers={["Tenant", "Invitations", "Status", "Plan"]} rows={rows} />
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold">Invitations</h3>
        <p className="text-sm text-ink/60">Suspend atau pulihkan undangan.</p>
        <div className="mt-4">
          <AdminInvitationBulkTable invitations={bulkRows} />
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold">Add-on Transactions</h3>
        <p className="text-sm text-ink/60">Daftar transaksi terbaru beserta add-on tema.</p>
        <div className="mt-4">
          <DataTable headers={["Tenant", "Invitation", "Plan", "Add-on", "Amount", "Status", "Date"]} rows={transactionRows} />
        </div>
      </div>
    </div>
  );
}
