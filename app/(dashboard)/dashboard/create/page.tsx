import { createInvitation } from "@/app/actions/invitations";
import { Button } from "@/components/ui/Button";
import { BuilderSection } from "@/components/ui/BuilderSection";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscription";
import { canCreateInvitation } from "@/lib/plans";

export default async function CreateInvitationPage() {
  const supabase = await createServerSupabase();
  const { plan, userId } = await getUserPlan();
  const { count: invitationCount } = await supabase
    .from("invitations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId ?? "");

  const canCreate = canCreateInvitation(plan, invitationCount ?? 0);
  const defaultTheme = "classic";

  return (
    <form className="grid gap-6" action={createInvitation}>
      <div className="card p-4 text-sm text-ink/70">
        Paket aktif: <span className="font-semibold uppercase">{plan}</span>. {canCreate ? "" : "Upgrade untuk membuat undangan baru."}
      </div>
      <BuilderSection title="Basic Info" description="Informasi dasar undangan.">
        <input name="title" placeholder="Invitation title" className="rounded-xl border border-black/10 px-4 py-3" required />
        <input name="slug" placeholder="Slug" className="rounded-xl border border-black/10 px-4 py-3" required />
        <select name="status" className="rounded-xl border border-black/10 px-4 py-3">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </BuilderSection>
      <BuilderSection title="Theme Settings" description="Tema akan ditentukan admin saat transaksi.">
        <div className="rounded-xl border border-black/10 px-4 py-3 text-sm text-graphite">
          Tema aktif: <span className="font-semibold text-ink">{defaultTheme}</span>
        </div>
        <input type="hidden" name="theme" value={defaultTheme} />
      </BuilderSection>
      <Button type="submit" disabled={!canCreate}>Buat Undangan</Button>
    </form>
  );
}
