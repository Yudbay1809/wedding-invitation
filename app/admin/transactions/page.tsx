import { createServerSupabase } from "@/lib/supabase/server";
import { DataTable } from "@/components/ui/DataTable";

const STATUS_OPTIONS = ["all", "paid", "pending", "refund"];

function statusBadge(status: string) {
  const base = "text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1 rounded-full";
  if (status === "paid") return <span className={`${base} bg-emerald/10 text-emerald`}>paid</span>;
  if (status === "pending") return <span className={`${base} bg-amber/10 text-amber`}>pending</span>;
  if (status === "refund") return <span className={`${base} bg-rose/10 text-rose`}>refund</span>;
  return <span className={`${base} bg-sand text-graphite`}>{status}</span>;
}

export default async function AdminTransactionsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createServerSupabase();
  const { status } = await searchParams;
  const filterStatus = STATUS_OPTIONS.includes(status ?? "") ? status : "all";

  let query = supabase
    .from("transactions")
    .select("id, user_id, invitation_id, plan, addon_theme, amount, currency, status, created_at")
    .order("created_at", { ascending: false });

  if (filterStatus && filterStatus !== "all") {
    query = query.eq("status", filterStatus);
  }

  const { data: transactions } = await query;

  const profileIds = (transactions ?? []).map((trx) => trx.user_id);
  const invitationIds = (transactions ?? []).map((trx) => trx.invitation_id).filter(Boolean) as string[];

  const { data: profiles } = profileIds.length
    ? await supabase.from("profiles").select("id, full_name, username").in("id", profileIds)
    : { data: [] };
  const { data: invitations } = invitationIds.length
    ? await supabase.from("invitations").select("id, title").in("id", invitationIds)
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const invitationMap = new Map((invitations ?? []).map((invitation) => [invitation.id, invitation.title]));

  const rows = (transactions ?? []).map((trx) => [
    profileMap.get(trx.user_id)?.full_name ?? profileMap.get(trx.user_id)?.username ?? trx.user_id,
    invitationMap.get(trx.invitation_id ?? "") ?? "-",
    trx.plan ?? "-",
    trx.addon_theme ?? "none",
    `${trx.currency ?? "IDR"} ${trx.amount ?? 0}`,
    statusBadge(trx.status ?? "paid"),
    trx.created_at ? new Date(trx.created_at).toLocaleDateString("id-ID") : "-"
  ]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Transactions</h2>
          <p className="text-sm text-ink/60">Kelola status transaksi dan ekspor CSV.</p>
        </div>
        <a className="text-sm text-emerald" href="/admin/transactions/export">Export CSV</a>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {STATUS_OPTIONS.map((option) => (
          <a
            key={option}
            href={`/admin/transactions${option === "all" ? "" : `?status=${option}`}`}
            className={`px-3 py-1 rounded-full border ${
              filterStatus === option ? "bg-ink text-white border-ink" : "border-black/10 text-graphite"
            }`}
          >
            {option.toUpperCase()}
          </a>
        ))}
      </div>

      {rows.length ? (
        <DataTable headers={["Tenant", "Invitation", "Plan", "Add-on", "Amount", "Status", "Date"]} rows={rows} />
      ) : (
        <div className="surface p-6 text-sm text-graphite">Belum ada transaksi.</div>
      )}
    </div>
  );
}
