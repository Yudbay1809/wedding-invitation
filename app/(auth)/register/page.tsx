"use client";

import Link from "next/link";
import { signUpWithFeedback } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
        {pending ? "Mendaftar..." : "Coba Gratis"}
      </Button>
    </>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(signUpWithFeedback, { ok: false, message: "" });
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      router.push("/dashboard");
    }
  }, [state.ok, router]);

  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch auth-fade">
      <div className="surface p-8">
        <h1 className="text-2xl font-semibold">Daftar</h1>
        <p className="text-sm text-graphite">Mulai coba gratis dan buat undangan pertama.</p>
        {state.message ? (
          <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
            {state.message}
          </div>
        ) : null}
        <form className="mt-6 grid gap-4" action={formAction}>
          <input name="email" type="email" placeholder="Email" className="rounded-xl border border-black/10 px-4 py-3" required />
          <input name="password" type="password" placeholder="Password" className="rounded-xl border border-black/10 px-4 py-3" required />
          <SubmitButton />
        </form>
        <div className="mt-4 text-sm text-graphite">
          Sudah punya akun? <Link href="/login" className="text-ocean">Masuk</Link>
        </div>
      </div>
      <AuthSidePanel
        title="Mulai undangan pertamamu"
        subtitle="Buat undangan cantik, kelola RSVP, dan dapatkan insight tamu."
        highlight="Tampilannya premium dan proses RSVP jadi rapi."
      />
    </div>
  );
}



