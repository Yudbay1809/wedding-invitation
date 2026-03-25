import { createServerSupabase } from "@/lib/supabase/server";

export default async function AdminActivityPage() {
  const supabase = await createServerSupabase();

  const { data: activities } = await supabase
    .from("admin_activity")
    .select("id, actor_id, action, target_type, target_id, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const actorIds = (activities ?? []).map((item) => item.actor_id);
  const { data: profiles } = actorIds.length
    ? await supabase.from("profiles").select("id, full_name, username").in("id", actorIds)
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">Activity Log</h2>
        <p className="text-sm text-ink/60">Jejak perubahan admin terbaru.</p>
      </div>

      <div className="surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand text-graphite">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Actor</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Action</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Target</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Metadata</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Time</th>
            </tr>
          </thead>
          <tbody>
            {(activities ?? []).map((activity, index) => {
              const actor = profileMap.get(activity.actor_id);
              return (
                <tr key={activity.id} className={index % 2 === 0 ? "bg-white" : "bg-cloud"}>
                  <td className="px-4 py-3 text-graphite">
                    <div className="text-sm text-ink">{actor?.full_name ?? "Admin"}</div>
                    <div className="text-xs text-graphite">@{actor?.username ?? activity.actor_id.slice(0, 6)}</div>
                  </td>
                  <td className="px-4 py-3 text-graphite">{activity.action}</td>
                  <td className="px-4 py-3 text-graphite">
                    <div className="text-xs uppercase tracking-[0.2em]">{activity.target_type}</div>
                    <div className="text-xs text-graphite">{activity.target_id ?? "-"}</div>
                  </td>
                  <td className="px-4 py-3 text-graphite">
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(activity.metadata ?? {}, null, 2)}</pre>
                  </td>
                  <td className="px-4 py-3 text-graphite">
                    {activity.created_at ? new Date(activity.created_at).toLocaleString("id-ID") : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
