"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import { setInvitationStatusWithFeedback } from "@/app/actions/invitations";

export function InvitationPublishToggle({
  invitationId,
  status,
  disabled
}: {
  invitationId: string;
  status: "draft" | "published" | "archived";
  disabled?: boolean;
}) {
  const nextStatus = status === "published" ? "draft" : "published";
  const action = setInvitationStatusWithFeedback.bind(null, invitationId, nextStatus);
  const [state, formAction] = useActionState(action, { ok: true, message: "" });
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!state.message) return;
    setToast({ message: state.message, tone: state.ok ? "success" : "error" });
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const isPublished = status === "published";

  return (
    <>
      {toast ? (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`rounded-2xl border px-4 py-3 text-sm shadow-lift ${
              toast.tone === "success"
                ? "border-emerald/30 bg-emerald/10 text-emerald"
                : "border-rose-200 bg-rose-50 text-rose-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
      <form action={formAction}>
        <button
          className={`relative inline-flex h-6 w-12 items-center rounded-full border transition ${
            isPublished ? "bg-emerald/20 border-emerald/30" : "bg-sand border-black/10"
          }`}
          type="submit"
          aria-label="Toggle publish"
          disabled={disabled}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
              isPublished ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </form>
    </>
  );
}


