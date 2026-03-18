"use client";

import Link from "next/link";
import { signInWithFeedback } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthSidePanel } from "@/components/auth/AuthSidePanel";

type FormState = { ok: boolean; message: string; redirectTo?: string };

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
        {pending ? "Masuk..." : "Masuk"}
      </Button>
    </>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(signInWithFeedback, { ok: false, message: "" });
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      router.push(state.redirectTo ?? "/dashboard");
    }
  }, [state.ok, state.redirectTo, router]);

  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch auth-fade">
      <div className="surface p-8">
        <h1 className="text-2xl font-semibold">Masuk</h1>
        <p className="text-sm text-graphite">Selamat datang kembali di WedSaaS.</p>
        {state.message ? (
          <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
            {state.message}
          </div>
        ) : null}
        <form className="mt-6 grid gap-4" action={formAction}>
          <input name="identifier" type="text" placeholder="Email atau username" className="rounded-xl border border-black/10 px-4 py-3" required />
          <input name="password" type="password" placeholder="Password" className="rounded-xl border border-black/10 px-4 py-3" required />
          <SubmitButton />
        </form>
        <div className="mt-4 flex justify-between text-sm text-graphite">
          <Link href="/forgot-password">Lupa password?</Link>
          <Link href="/register">Buat akun</Link>
        </div>
      </div>
      <AuthSidePanel
        title="Kembali ke dashboard undangan"
        subtitle="Kelola undangan, pantau RSVP, dan lihat analytics dalam satu tempat."
        highlight="Tamu langsung paham dan RSVP naik drastis."
      />
    </div>
  );
}



