"use client";

import Link from "next/link";
import { resetPasswordWithFeedback } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { useActionState, useFormStatus } from "react-dom";
import { AuthSidePanel } from "@/components/auth/AuthSidePanel";

type FormState = { ok: boolean; message: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="surface px-6 py-4 text-sm">Memproses...</div>
        </div>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Mengirim..." : "Kirim"}
      </Button>
    </>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(resetPasswordWithFeedback, { ok: false, message: "" });

  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch auth-fade">
      <div className="surface p-8">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <p className="text-sm text-graphite">Kami akan mengirim email reset password.</p>
        {state.message ? (
          <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
            {state.message}
          </div>
        ) : null}
        <form className="mt-6 grid gap-4" action={formAction}>
          <input name="email" type="email" placeholder="Email" className="rounded-xl border border-black/10 px-4 py-3" required />
          <SubmitButton />
        </form>
        <div className="mt-4 text-sm text-graphite">
          <Link href="/login">Kembali ke login</Link>
        </div>
      </div>
      <AuthSidePanel
        title="Akses aman untuk akunmu"
        subtitle="Kami menjaga keamanan akun dan data undanganmu."
        highlight="Akun aman, undangan tetap berjalan."
      />
    </div>
  );
}

