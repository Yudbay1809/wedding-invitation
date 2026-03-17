"use client";

import { useState } from "react";
import { bulkSetGuestMessageVisibility, setGuestMessageVisibility } from "@/app/actions/messages";

export function GuestMessagesBulkTable({
  messages
}: {
  messages: Array<{ id: string; name: string; message: string; is_hidden: boolean }>;
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const allSelected = messages.length > 0 && messages.every((msg) => selected[msg.id]);

  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    messages.forEach((msg) => {
      next[msg.id] = checked;
    });
    setSelected(next);
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: checked }));
  };

  const badgeClass = (hidden: boolean) =>
    hidden ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-emerald/10 text-emerald border border-emerald/20";

  return (
    <div className="grid gap-4">
      <form id="bulk-messages" action={bulkSetGuestMessageVisibility} className="flex flex-wrap items-center gap-3 text-sm">
        <select name="hidden" className="rounded-lg border border-black/10 px-3 py-2 text-sm" defaultValue="true">
          <option value="true">Hide Selected</option>
          <option value="false">Unhide Selected</option>
        </select>
        <button className="text-sm text-emerald" type="submit">Apply</button>
      </form>
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
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Name</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Message</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Status</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, index) => (
              <tr key={msg.id} className={index % 2 === 0 ? "bg-white" : "bg-cloud"}>
                <td className="px-4 py-3 text-graphite">
                  <input
                    type="checkbox"
                    name="message_ids"
                    value={msg.id}
                    form="bulk-messages"
                    checked={!!selected[msg.id]}
                    onChange={(event) => toggleOne(msg.id, event.target.checked)}
                  />
                </td>
                <td className="px-4 py-3 text-graphite">{msg.name}</td>
                <td className="px-4 py-3 text-graphite">{msg.message}</td>
                <td className="px-4 py-3 text-graphite">
                  <span className={`text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${badgeClass(msg.is_hidden)}`}>
                    {msg.is_hidden ? "Hidden" : "Visible"}
                  </span>
                </td>
                <td className="px-4 py-3 text-graphite">
                  <form action={setGuestMessageVisibility}>
                    <input type="hidden" name="message_id" value={msg.id} />
                    <input type="hidden" name="hidden" value={String(!msg.is_hidden)} />
                    <button className="text-xs text-emerald" type="submit">
                      {msg.is_hidden ? "Show" : "Hide"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
