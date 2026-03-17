import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { signOut } from "@/app/actions/auth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-sand">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <header className="flex items-center justify-between px-6 py-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-graphite">WedSaaS</p>
              <h1 className="text-2xl font-semibold">User Dashboard</h1>
            </div>
            <form action={signOut}>
              <button className="text-sm text-graphite">Keluar</button>
            </form>
          </header>
          <main className="px-6 pb-12">{children}</main>
        </div>
      </div>
    </div>
  );
}
