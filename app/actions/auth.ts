"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export async function signIn(formData: FormData) {
  const identifier = String(formData.get("identifier") || formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password"));
  const supabase = await createServerSupabase();

  let email = identifier;
  if (!identifier.includes("@")) {
    const admin = createAdminSupabase();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id")
      .ilike("username", identifier)
      .maybeSingle();
    if (profileError) {
      throw new Error("Database belum update. Jalankan supabase db reset.");
    }
    if (!profile?.id) {
      throw new Error("Username tidak ditemukan.");
    }
    const { data, error: userError } = await admin.auth.admin.getUserById(profile.id);
    if (userError || !data.user?.email) {
      throw new Error("Username tidak ditemukan.");
    }
    email = data.user.email;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.user?.id) {
    const username = email.split("@")[0];
    await supabase.from("profiles").upsert({ id: data.user.id, username });
  }

  redirect("/dashboard");
}

export async function resetPassword(formData: FormData) {
  const email = String(formData.get("email"));
  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signInWithFeedback(
  prevState: { ok: boolean; message: string; redirectTo?: string },
  formData: FormData
) {
  try {
    const identifier = String(formData.get("identifier") || formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "").trim();
    if (!identifier || !password) {
      return { ok: false, message: "Email/username dan password wajib diisi." };
    }
    const supabase = await createServerSupabase();
    let email = identifier;
    if (!identifier.includes("@")) {
      const admin = createAdminSupabase();
      const { data: profile, error: profileError } = await admin
        .from("profiles")
        .select("id")
        .ilike("username", identifier)
        .maybeSingle();
      if (profileError) {
        return { ok: false, message: "Database belum update. Jalankan supabase db reset." };
      }
      if (!profile?.id) {
        return { ok: false, message: "Username tidak ditemukan." };
      }
      const { data, error: userError } = await admin.auth.admin.getUserById(profile.id);
      if (userError || !data.user?.email) {
        return { ok: false, message: "Username tidak ditemukan." };
      }
      email = data.user.email;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { ok: false, message: error.message };
    }
    const { data: userData } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user?.id ?? "")
      .single();
    const redirectTo = profile?.role === "admin" ? "/admin" : "/dashboard";
    return { ok: true, message: "Login berhasil. Mengarahkan...", redirectTo };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Login gagal." };
  }
}

export async function signUpWithFeedback(prevState: { ok: boolean; message: string }, formData: FormData) {
  try {
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    if (!email || !password) {
      return { ok: false, message: "Email dan password wajib diisi." };
    }
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` }
    });
    if (error) {
      return { ok: false, message: error.message };
    }
    if (data.user?.id) {
      const username = email.split("@")[0];
      await supabase.from("profiles").upsert({ id: data.user.id, username });
    }
    return { ok: true, message: "Akun berhasil dibuat. Mengarahkan..." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Pendaftaran gagal." };
  }
}

export async function resetPasswordWithFeedback(prevState: { ok: boolean; message: string }, formData: FormData) {
  try {
    const email = String(formData.get("email") || "").trim();
    if (!email) {
      return { ok: false, message: "Email wajib diisi." };
    }
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`
    });
    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true, message: "Email reset password sudah dikirim." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Gagal mengirim reset password." };
  }
}
