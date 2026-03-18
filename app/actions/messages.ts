"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitGuestMessage(invitationId: string, formData: FormData) {
  const supabase = await createServerSupabase();
  const name = String(formData.get("name") || "").trim();
  const message = String(formData.get("message") || "").trim();
  if (!name || !message) {
    throw new Error("Ucapan tidak boleh kosong.");
  }

  const payload = {
    invitation_id: invitationId,
    name,
    message
  };

  const { error } = await supabase.from("guest_messages").insert(payload);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/messages");
}

export async function submitGuestMessageWithFeedback(invitationId: string, prevState: { ok: boolean; message: string }, formData: FormData) {
  try {
    await submitGuestMessage(invitationId, formData);
    return { ok: true, message: "Ucapan terkirim. Terima kasih." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Gagal mengirim ucapan." };
  }
}

export async function setGuestMessageVisibility(formData: FormData) {
  const supabase = await createServerSupabase();
  const messageId = String(formData.get("message_id"));
  const hidden = String(formData.get("hidden")) === "true";

  const { error } = await supabase
    .from("guest_messages")
    .update({ is_hidden: hidden })
    .eq("id", messageId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/messages");
}

export async function bulkSetGuestMessageVisibility(formData: FormData) {
  const supabase = await createServerSupabase();
  const ids = formData.getAll("message_ids").map(String).filter(Boolean);
  const hidden = String(formData.get("hidden")) === "true";

  if (ids.length === 0) {
    throw new Error("Pilih minimal satu pesan.");
  }

  const { error } = await supabase
    .from("guest_messages")
    .update({ is_hidden: hidden })
    .in("id", ids);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/messages");
}
