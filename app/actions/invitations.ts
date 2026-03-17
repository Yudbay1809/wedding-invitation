"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canCreateInvitation } from "@/lib/plans";
import { getUserPlan } from "@/lib/subscription";

export async function createInvitation(formData: FormData) {
  const supabase = await createServerSupabase();
  const title = String(formData.get("title"));
  const slug = String(formData.get("slug"));
  const status = String(formData.get("status"));
  const themeInput = String(formData.get("theme"));

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/login");
  }

  const { plan } = await getUserPlan();
  const { count: invitationCount } = await supabase
    .from("invitations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id);

  if (!canCreateInvitation(plan, invitationCount ?? 0)) {
    throw new Error("Upgrade plan untuk membuat lebih banyak undangan.");
  }

  const theme = themeInput || "classic";
  const { data, error } = await supabase
    .from("invitations")
    .insert({
      user_id: userData.user.id,
      title,
      slug,
      status,
      theme,
      updated_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/invitations");
  redirect(`/dashboard/invitations/${data.id}`);
}

export async function updateInvitation(id: string, formData: FormData) {
  const supabase = await createServerSupabase();
  const payload = Object.fromEntries(formData.entries());
  const updatedPayload = { ...payload, updated_at: new Date().toISOString() };

  const { error } = await supabase.from("invitations").update(updatedPayload).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/invitations/${id}`);
}

export async function archiveInvitation(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("invitations")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/dashboard/invitations");
}

export async function duplicateInvitation(id: string) {
  const supabase = await createServerSupabase();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("title, slug, theme, status, user_id")
    .eq("id", id)
    .single();

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  const slug = `${invitation.slug}-copy-${Date.now()}`;
  const { error } = await supabase.from("invitations").insert({
    user_id: invitation.user_id,
    title: `${invitation.title} (Copy)`,
    slug,
    theme: invitation.theme,
    status: "draft",
    updated_at: new Date().toISOString()
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/invitations");
}

export async function setInvitationStatus(id: string, status: "draft" | "published") {
  if (status !== "draft" && status !== "published") {
    throw new Error("Invalid status");
  }
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("invitations")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/invitations");
  revalidatePath(`/dashboard/invitations/${id}`);
}

export async function setInvitationStatusWithFeedback(
  id: string,
  status: "draft" | "published",
  prevState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await setInvitationStatus(id, status);
    return { ok: true, message: status === "published" ? "Undangan dipublish." : "Undangan disimpan sebagai draft." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Gagal mengubah status." };
  }
}
