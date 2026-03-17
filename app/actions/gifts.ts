"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function confirmGift(invitationId: string, formData: FormData) {
  const supabase = await createServerSupabase();
  const name = String(formData.get("name") || "").trim();
  const amount = Number(formData.get("amount"));
  if (!name || !amount || amount < 1) {
    throw new Error("Data konfirmasi tidak lengkap.");
  }

  const payload = {
    invitation_id: invitationId,
    name,
    amount,
    message: String(formData.get("message") || "")
  };

  const { error } = await supabase.from("gift_confirmations").insert(payload);
  if (error) {
    throw new Error(error.message);
  }
}

export async function confirmGiftWithFeedback(invitationId: string, prevState: { ok: boolean; message: string }, formData: FormData) {
  try {
    await confirmGift(invitationId, formData);
    return { ok: true, message: "Konfirmasi terkirim. Terima kasih." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Gagal mengirim konfirmasi." };
  }
}
