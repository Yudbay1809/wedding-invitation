import Link from "next/link";
import { InvitationCard } from "@/components/dashboard/InvitationCard";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { createServerSupabase } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function InvitationsPage() {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  const { data: invitations } = await supabase
    .from("invitations")
    .select("id, title, slug, status, updated_at")
    .eq("user_id", userData.user?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Invitations</h2>
          <p className="text-sm text-graphite">Kelola semua undangan kamu.</p>
        </div>
        <Link href="/dashboard/create">
          <Button>+ Buat Undangan</Button>
        </Link>
      </div>
      <SearchBar placeholder="Cari undangan..." />
      {invitations && invitations.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {invitations.map((invitation) => (
            <InvitationCard key={invitation.id} {...invitation} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Belum ada undangan"
          description="Buat undangan pertama kamu untuk mulai berbagi."
          actionLabel="Buat Undangan"
          actionHref="/dashboard/create"
        />
      )}
    </div>
  );
}
