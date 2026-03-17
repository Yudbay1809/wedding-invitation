import { createServerSupabase } from "@/lib/supabase/server";
import { createGuest } from "@/app/actions/guests";
import { EmptyState } from "@/components/ui/EmptyState";
import { GuestListTable } from "@/components/dashboard/GuestListTable";

export default async function GuestTokensPage() {
  const supabase = await createServerSupabase();
  const { data: invitations } = await supabase
    .from("invitations")
    .select("id, title, slug")
    .order("created_at", { ascending: false });

  const { data: guests } = await supabase
    .from("invitation_guests")
    .select("id, name, token, max_guests, is_active, created_at, invitations ( title, slug )")
    .order("created_at", { ascending: false });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Guest Tokens</h1>
        <p className="text-sm text-graphite">Generate link undangan personal untuk tiap tamu.</p>
      </div>

      {!invitations?.length ? (
        <EmptyState
          title="Belum ada undangan"
          description="Buat undangan terlebih dahulu agar bisa membuat token tamu."
          actionLabel="Buat Undangan"
          actionHref="/dashboard/create"
        />
      ) : (
        <div className="surface p-6">
          <h2 className="text-lg font-semibold">Tambah Tamu</h2>
          <p className="text-sm text-graphite mt-1">Link undangan akan dibuat otomatis.</p>
          <form className="mt-4 grid gap-4" action={createGuest}>
            <div className="grid md:grid-cols-3 gap-3">
              <select name="invitation_id" className="rounded-xl border border-black/10 px-4 py-3" required>
                {invitations.map((invitation) => (
                  <option key={invitation.id} value={invitation.id}>{invitation.title}</option>
                ))}
              </select>
              <input name="name" placeholder="Nama tamu" className="rounded-xl border border-black/10 px-4 py-3" required />
              <input name="max_guests" type="number" min={1} defaultValue={1} placeholder="Max guests" className="rounded-xl border border-black/10 px-4 py-3" />
            </div>
            <button className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white w-fit" type="submit">
              Generate Token
            </button>
          </form>
        </div>
      )}

      {guests?.length ? (
        <GuestListTable
          guests={guests.map((guest) => ({
            id: guest.id,
            name: guest.name,
            token: guest.token,
            max_guests: guest.max_guests,
            is_active: guest.is_active,
            created_at: guest.created_at,
            invitation: Array.isArray(guest.invitations) ? guest.invitations[0] ?? null : guest.invitations ?? null
          }))}
          siteUrl={siteUrl}
        />
      ) : (
        <EmptyState
          title="Belum ada tamu"
          description="Tambahkan tamu untuk menghasilkan link undangan personal."
        />
      )}
    </div>
  );
}
