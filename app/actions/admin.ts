"use server";

import { requireAdmin } from "@/lib/subscription";
import { resolveCheckoutTheme } from "@/lib/plans";
import { calculateCheckoutPrice } from "@/lib/pricing";
import { revalidatePath } from "next/cache";

export async function updateTenantSubscription(formData: FormData) {
  const { supabase } = await requireAdmin();
  const userId = String(formData.get("user_id"));
  const plan = String(formData.get("plan"));
  const status = String(formData.get("status") || "active");

  const { error } = await supabase
    .from("subscriptions")
    .upsert({ user_id: userId, plan, status });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function setInvitationStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const invitationId = String(formData.get("invitation_id"));
  const status = String(formData.get("status"));

  if (!invitationId) {
    throw new Error("Invitation id missing");
  }

  const { error } = await supabase
    .from("invitations")
    .update({ status })
    .eq("id", invitationId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function bulkUpdateInvitationStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const ids = formData.getAll("invitation_ids").map(String).filter(Boolean);
  const status = String(formData.get("bulk_status") || "archived");

  if (ids.length === 0) {
    throw new Error("Pilih minimal satu undangan.");
  }

  const { error } = await supabase
    .from("invitations")
    .update({ status })
    .in("id", ids);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function setInvitationTheme(formData: FormData) {
  const { supabase } = await requireAdmin();
  const invitationId = String(formData.get("invitation_id"));
  const theme = String(formData.get("theme") || "classic");
  const themeLocked = String(formData.get("theme_locked") || "false") === "true";

  if (!invitationId) {
    throw new Error("Invitation id missing");
  }

  const { error } = await supabase
    .from("invitations")
    .update({ theme, theme_locked: themeLocked, updated_at: new Date().toISOString() })
    .eq("id", invitationId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/invitations");
}

export async function createInvitationFromCheckout(formData: FormData) {
  const { supabase } = await requireAdmin();
  const userId = String(formData.get("user_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const plan = String(formData.get("plan") || "free").trim();
  const addonTheme = String(formData.get("addon_theme") || "").trim();
  const lockTheme = String(formData.get("theme_locked") || "false") === "true";
  const status = String(formData.get("payment_status") || "paid").trim();

  if (!userId || !title || !slug) {
    throw new Error("Data transaksi tidak lengkap.");
  }

  const { error: planError } = await supabase
    .from("subscriptions")
    .upsert({ user_id: userId, plan, status: "active" });

  if (planError) {
    throw new Error(planError.message);
  }

  const theme = resolveCheckoutTheme(plan as "free" | "premium" | "business", addonTheme);
  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert({
      user_id: userId,
      title,
      slug,
      theme,
      theme_locked: lockTheme,
      status: "draft",
      updated_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const price = calculateCheckoutPrice(plan as "free" | "premium" | "business", addonTheme);
  const { error: transactionError } = await supabase.from("transactions").insert({
    user_id: userId,
    invitation_id: invitation.id,
    plan,
    addon_theme: addonTheme || null,
    amount: price.total,
    currency: price.currency,
    status
  });

  if (transactionError) {
    throw new Error(transactionError.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/invitations");
}
