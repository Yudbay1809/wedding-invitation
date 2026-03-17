"use client";

import { useMemo, useState } from "react";
import { deleteGuest, setGuestActive } from "@/app/actions/guests";

type GuestRow = {
  id: string;
  name: string;
  token: string;
  max_guests: number | null;
  is_active: boolean;
  created_at: string | null;
  invitation: { title: string | null; slug: string | null } | null;
};

export function GuestListTable({
  guests,
  siteUrl
}: {
  guests: GuestRow[];
  siteUrl: string;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const normalizedSiteUrl = useMemo(() => siteUrl.replace(/\/$/, ""), [siteUrl]);

  const handleCopy = async (guestId: string, link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(guestId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="surface overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-sand text-graphite">
          <tr>
            <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Nama</th>
            <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Undangan</th>
            <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Kuota</th>
            <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Status</th>
            <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Link</th>
            <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Action</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, index) => {
            const slug = guest.invitation?.slug;
            const link = slug ? `${normalizedSiteUrl}/invite/${slug}?guest=${guest.token}` : "";
            return (
              <tr key={guest.id} className={index % 2 === 0 ? "bg-white" : "bg-cloud"}>
                <td className="px-4 py-3 text-graphite">{guest.name}</td>
                <td className="px-4 py-3 text-graphite">{guest.invitation?.title ?? "-"}</td>
                <td className="px-4 py-3 text-graphite">{guest.max_guests ?? 1}</td>
                <td className="px-4 py-3 text-graphite">
                  <span className={`text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${guest.is_active ? "bg-emerald/10 text-emerald border border-emerald/20" : "bg-rose-50 text-rose-600 border border-rose-200"}`}>
                    {guest.is_active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3 text-graphite">
                  {link ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono truncate max-w-[240px]">{link}</span>
                      <button
                        type="button"
                        className="text-xs text-emerald"
                        onClick={() => handleCopy(guest.id, link)}
                      >
                        {copiedId === guest.id ? "Copied" : "Copy"}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-graphite">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-graphite">
                  <div className="flex items-center gap-3 text-xs">
                    <form action={setGuestActive}>
                      <input type="hidden" name="guest_id" value={guest.id} />
                      <input type="hidden" name="is_active" value={String(!guest.is_active)} />
                      <button className="text-emerald" type="submit">
                        {guest.is_active ? "Disable" : "Enable"}
                      </button>
                    </form>
                    <form action={deleteGuest}>
                      <input type="hidden" name="guest_id" value={guest.id} />
                      <button
                        className="text-rose-500"
                        type="submit"
                        onClick={(event) => {
                          if (!confirm("Hapus tamu ini?")) {
                            event.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
