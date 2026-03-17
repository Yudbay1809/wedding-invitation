"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

type FormState = { ok: boolean; message: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="rounded-full bg-ink text-white px-5 py-2.5 text-sm font-semibold" type="submit" disabled={pending}>
      {pending ? "Mengirim..." : "Kirim Konfirmasi"}
    </button>
  );
}

export function GiftConfirmForm({
  action
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction] = useFormState(action, { ok: false, message: "" });
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
          {state.message || "Konfirmasi terkirim. Terima kasih."}
        </div>
      ) : null}
      {state.ok === false && state.message ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600">
          {state.message}
        </div>
      ) : null}
      <form className="grid gap-4" action={formAction}>
        <input name="name" placeholder="Nama" className="rounded-xl border border-black/10 px-4 py-3" required />
        <input name="amount" type="number" placeholder="Nominal" className="rounded-xl border border-black/10 px-4 py-3" required />
        <textarea name="message" placeholder="Pesan" className="rounded-xl border border-black/10 px-4 py-3" rows={3} />
        <SubmitButton />
      </form>
    </div>
  );
}
