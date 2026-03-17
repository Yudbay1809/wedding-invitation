"use client";

import { useState } from "react";
import { bulkUpdateInvitationStatus, setInvitationStatus } from "@/app/actions/admin";

export function AdminInvitationBulkTable({
  invitations
}: {
  invitations: Array<{ id: string; title: string; slug: string; owner: string; status: string }>;
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const allSelected = invitations.length > 0 && invitations.every((inv) => selected[inv.id]);

  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    invitations.forEach((inv) => {
      next[inv.id] = checked;
    });
    setSelected(next);
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <form action={bulkUpdateInvitationStatus} className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <select name="bulk_status" className="rounded-lg border border-black/10 px-3 py-2 text-sm">
          <option value="archived">Suspend Selected</option>
          <option value="published">Publish Selected</option>
          <option value="draft">Set Draft</option>
        </select>
        <button className="text-sm text-emerald" type="submit">Apply Bulk Action</button>
      </div>
      <div className="surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand text-graphite">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) => toggleAll(event.target.checked)}
                  />
                  Select
                </label>
              </th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Title</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Slug</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Owner</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Status</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Action</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((inv, index) => (
              <tr key={inv.id} className={index % 2 === 0 ? "bg-white" : "bg-cloud"}>
                <td className="px-4 py-3 text-graphite">
                  <input
                    type="checkbox"
                    name="invitation_ids"
                    value={inv.id}
                    checked={!!selected[inv.id]}
                    onChange={(event) => toggleOne(inv.id, event.target.checked)}
                  />
                </td>
                <td className="px-4 py-3 text-graphite">{inv.title}</td>
                <td className="px-4 py-3 text-graphite">{inv.slug}</td>
                <td className="px-4 py-3 text-graphite">{inv.owner}</td>
                <td className="px-4 py-3 text-graphite">{inv.status}</td>
                <td className="px-4 py-3 text-graphite">
                  <form action={setInvitationStatus}>
                    <input type="hidden" name="invitation_id" value={inv.id} />
                    <select name="status" defaultValue={inv.status} className="rounded-lg border border-black/10 px-2 py-1 text-xs">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Suspended</option>
                    </select>
                    <button className="ml-2 text-xs text-emerald" type="submit">Update</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}