import Link from "next/link";
import { InvitationCard } from "@/components/dashboard/InvitationCard";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { createServerSupabase } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function InvitationsPage({
  searchParams
}: {
  searchParams?: Promise<{ status?: string; q?: string }>;
}) {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const statusFilter = resolvedSearchParams?.status ?? "all";
  const searchQuery = resolvedSearchParams?.q?.trim() ?? "";

  const { data: allInvitations } = await supabase
    .from("invitations")
    .select("status")
    .eq("user_id", userData.user?.id ?? "");

  const counts = { all: allInvitations?.length ?? 0, published: 0, draft: 0, archived: 0 };
  (allInvitations ?? []).forEach((inv) => {
    if (inv.status === "published") counts.published += 1;
    else if (inv.status === "archived") counts.archived += 1;
    else counts.draft += 1;
  });

  let query = supabase
    .from("invitations")
    .select("id, title, slug, status, updated_at")
    .eq("user_id", userData.user?.id ?? "")
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }
  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`);
  }

  const { data: invitations } = await query;

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBar placeholder="Cari undangan..." action="/dashboard/invitations" defaultValue={searchQuery} />
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: "all", label: `Semua (${counts.all})` },
            { id: "published", label: `Published (${counts.published})` },
            { id: "draft", label: `Draft (${counts.draft})` },
            { id: "archived", label: `Archived (${counts.archived})` }
          ].map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/invitations${item.id === "all" ? "" : `?status=${item.id}`}${searchQuery ? `${item.id === "all" ? "?" : "&"}q=${encodeURIComponent(searchQuery)}` : ""}`}
              className={`rounded-full border px-3 py-1 ${
                statusFilter === item.id ? "bg-ink text-white border-ink" : "border-black/10 text-graphite"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
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
