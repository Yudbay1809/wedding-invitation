import Link from "next/link";

const items = [
  { label: "Overview", href: "/dashboard" },
  { label: "Invitations", href: "/dashboard/invitations" },
  { label: "Create Invitation", href: "/dashboard/create" },
  { label: "RSVP Management", href: "/dashboard/rsvp" },
  { label: "Guest Tokens", href: "/dashboard/guests" },
  { label: "Guest Messages", href: "/dashboard/messages" },
  { label: "Digital Gift Settings", href: "/dashboard/gifts" },
  { label: "Theme Settings", href: "/dashboard/themes" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Subscription", href: "/dashboard/subscription" },
  { label: "White Label", href: "/dashboard/white-label" },
  { label: "Account Settings", href: "/dashboard/account" }
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-72 flex-col gap-6 bg-white border-r border-black/5 p-6 sticky top-0 h-screen">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-graphite">WedSaaS</p>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>
      <nav className="flex-1 flex flex-col gap-2 text-sm">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl px-4 py-2 hover:bg-sand">
            {item.label}
          </Link>
        ))}
      </nav>
      <Link href="/" className="text-sm text-graphite">Kembali ke Marketing</Link>
    </aside>
  );
}
