import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#fffdf9]">
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-black/5">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <nav className="flex items-center gap-3 text-sm text-ink/60">
            <Link href="/admin" className="hover:text-ink">Overview</Link>
            <Link href="/admin/checkout" className="hover:text-ink">Checkout</Link>
            <Link href="/admin/invitations" className="hover:text-ink">Invitations</Link>
            <Link href="/admin/transactions" className="hover:text-ink">Transactions</Link>
          </nav>
        </div>
        <Link href="/dashboard" className="text-sm text-ink/60">Back to Dashboard</Link>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
