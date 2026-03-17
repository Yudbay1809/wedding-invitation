import Link from "next/link";

export default async function ThemeSettingsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">Theme Settings</h2>
        <p className="text-sm text-ink/60">Tema dikunci per undangan oleh admin sesuai transaksi.</p>
      </div>
      <div className="rounded-xl border border-black/10 px-4 py-3 text-sm text-graphite">
        Kelola tema pada setiap undangan di halaman detail undangan.
      </div>
      <Link className="text-sm text-ocean" href="/dashboard/invitations">
        Buka daftar undangan
      </Link>
    </div>
  );
}
