"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./Button";

type FormState = { ok: boolean; message: string };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Mengirim..." : label}
    </Button>
  );
}

export function RSVPForm({
  action,
  defaultName,
  lockName,
  hideName,
  guestToken
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  defaultName?: string;
  lockName?: boolean;
  hideName?: boolean;
  guestToken?: string;
}) {
  const [state, formAction] = useActionState(action, { ok: false, message: "" });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (state.ok) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state.ok]);

  return (
    <div className="grid gap-4">
      {showToast ? (
        <div className="rounded-2xl bg-white border border-black/5 px-4 py-3 text-sm text-graphite">
          {state.message || "RSVP terkirim. Terima kasih."}
        </div>
      ) : null}
      {state.ok === false && state.message ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600">
          {state.message}
        </div>
      ) : null}
      <form className="grid gap-4" action={formAction}>
        {guestToken ? <input type="hidden" name="guest_token" value={guestToken} /> : null}
        {hideName ? (
          <div className="rounded-xl border border-black/10 px-4 py-3 bg-sand text-graphite text-sm">
            {defaultName || "Tamu Undangan"}
            <input type="hidden" name="name" value={defaultName || ""} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            <input
              name="name"
              placeholder="Nama"
              defaultValue={defaultName}
              readOnly={lockName}
              className={`rounded-xl border border-black/10 px-4 py-3 ${lockName ? "bg-sand text-graphite" : ""}`}
              required
            />
            <input name="whatsapp" placeholder="WhatsApp" className="rounded-xl border border-black/10 px-4 py-3" required />
          </div>
        )}
        {hideName ? (
          <input name="whatsapp" placeholder="WhatsApp" className="rounded-xl border border-black/10 px-4 py-3" required />
        ) : null}
        <div className="grid md:grid-cols-2 gap-3">
          <input name="guest_count" type="number" min={1} placeholder="Jumlah tamu" className="rounded-xl border border-black/10 px-4 py-3" required />
          <select name="status" className="rounded-xl border border-black/10 px-4 py-3" required>
            <option value="attending">Hadir</option>
            <option value="declined">Berhalangan</option>
          </select>
        </div>
        <textarea name="message" placeholder="Ucapan" className="rounded-xl border border-black/10 px-4 py-3" rows={3} />
        <SubmitButton label="Kirim RSVP" />
      </form>
    </div>
  );
}



