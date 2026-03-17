import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4">
      <h1 className="text-3xl font-semibold">Undangan tidak ditemukan</h1>
      <p className="text-sm text-ink/60">Pastikan link undangan sudah benar.</p>
      <Link href="/" className="text-sm text-emerald">Kembali ke Home</Link>
    </div>
  );
}
