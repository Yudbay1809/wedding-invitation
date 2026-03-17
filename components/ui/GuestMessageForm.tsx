"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "./Button";

type FormState = { ok: boolean; message: string };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "Mengirim..." : label}
    </Button>
  );
}

export function GuestMessageForm({
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
          {state.message || "Ucapan terkirim. Terima kasih."}
        </div>
      ) : null}
      {state.ok === false && state.message ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600">
          {state.message}
        </div>
      ) : null}
      <form className="grid gap-4" action={formAction}>
        <input name="name" placeholder="Nama" className="rounded-xl border border-black/10 px-4 py-3" required />
        <textarea name="message" placeholder="Ucapan" className="rounded-xl border border-black/10 px-4 py-3" rows={4} required />
        <SubmitButton label="Kirim Ucapan" />
      </form>
    </div>
  );
}
