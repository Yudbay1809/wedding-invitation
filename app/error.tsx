"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-sand text-ink flex items-center justify-center">
        <div className="surface p-8 max-w-md text-center">
          <h1 className="text-2xl font-semibold">Ada yang tidak beres</h1>
          <p className="text-sm text-graphite mt-2">{error.message}</p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-full bg-ink text-white px-5 py-2.5 text-sm font-semibold"
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
