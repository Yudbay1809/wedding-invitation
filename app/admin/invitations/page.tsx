import { createServerSupabase } from "@/lib/supabase/server";
import { setInvitationTheme } from "@/app/actions/admin";

const THEMES = [
  { id: "classic", name: "Classic" },
  { id: "minimal", name: "Minimal" },
  { id: "romantic", name: "Romantic" },
  { id: "luxury", name: "Luxury" },
  { id: "boho", name: "Boho" },
  { id: "garden", name: "Garden" },
  { id: "modern", name: "Modern" },
  { id: "celestial", name: "Celestial" }
];

export default async function AdminInvitationsPage() {
  const supabase = await createServerSupabase();

  const { data: invitations } = await supabase
    .from("invitations")
    .select("id, user_id, title, slug, theme, theme_locked, status, updated_at")
    .order("updated_at", { ascending: false });

  const invitationUserIds = (invitations ?? []).map((inv) => inv.user_id);
  const { data: profiles } = invitationUserIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, username")
        .in("id", invitationUserIds)
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">Invitation Themes</h2>
        <p className="text-sm text-ink/60">Set tema per undangan sesuai transaksi.</p>
      </div>

      <div className="surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand text-graphite">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Invitation</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Owner</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Status</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Theme & Lock</th>
            </tr>
          </thead>
          <tbody>
            {(invitations ?? []).map((invitation, index) => {
              const owner = profileMap.get(invitation.user_id);
              return (
                <tr key={invitation.id} className={index % 2 === 0 ? "bg-white" : "bg-cloud"}>
                  <td className="px-4 py-3 text-graphite">
                    <div className="font-semibold text-ink">{invitation.title}</div>
                    <div className="text-xs text-graphite">/{invitation.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-graphite">
                    <div className="text-sm text-ink">{owner?.full_name ?? "User"}</div>
                    <div className="text-xs text-graphite">@{owner?.username ?? invitation.user_id.slice(0, 6)}</div>
                  </td>
                  <td className="px-4 py-3 text-graphite">
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-sand text-graphite">
                      {invitation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-graphite">
                    <form action={setInvitationTheme} className="flex flex-wrap items-center gap-3">
                      <input type="hidden" name="invitation_id" value={invitation.id} />
                      <select name="theme" defaultValue={invitation.theme ?? "classic"} className="rounded-lg border border-black/10 px-2 py-1 text-xs">
                        {THEMES.map((theme) => (
                          <option key={theme.id} value={theme.id}>{theme.name}</option>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 text-xs text-graphite">
                        <input type="checkbox" name="theme_locked" value="true" defaultChecked={Boolean(invitation.theme_locked)} />
                        Lock tema
                      </label>
                      <button className="text-xs text-emerald" type="submit">Save</button>
                    </form>
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
