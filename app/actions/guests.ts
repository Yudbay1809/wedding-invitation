"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { createServerSupabase } from "@/lib/supabase/server";

function generateToken() {
  return randomBytes(16).toString("hex");
}

export async function createGuest(formData: FormData) {
  const supabase = await createServerSupabase();
  const invitationId = String(formData.get("invitation_id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const maxGuestsRaw = Number(formData.get("max_guests"));
  const maxGuests = Number.isFinite(maxGuestsRaw) && maxGuestsRaw > 0 ? Math.floor(maxGuestsRaw) : 1;

  if (!invitationId || !name) {
    throw new Error("Data tamu tidak lengkap.");
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const token = generateToken();
    const { error } = await supabase.from("invitation_guests").insert({
      invitation_id: invitationId,
      name,
      token,
      max_guests: maxGuests
    });
    if (!error) {
      revalidatePath("/dashboard/guests");
      return;
    }
    if (error.code !== "23505") {
      throw new Error(error.message);
    }
    lastError = new Error(error.message);
  }

  throw lastError ?? new Error("Gagal membuat token tamu.");
}

export async function setGuestActive(formData: FormData) {
  const supabase = await createServerSupabase();
  const guestId = String(formData.get("guest_id") || "").trim();
  const isActive = String(formData.get("is_active") || "") === "true";
  if (!guestId) {
    throw new Error("Tamu tidak valid.");
  }

  const { error } = await supabase
    .from("invitation_guests")
    .update({ is_active: isActive })
    .eq("id", guestId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/dashboard/guests");
}

export async function deleteGuest(formData: FormData) {
  const supabase = await createServerSupabase();
  const guestId = String(formData.get("guest_id") || "").trim();
  if (!guestId) {
    throw new Error("Tamu tidak valid.");
  }

  const { error } = await supabase.from("invitation_guests").delete().eq("id", guestId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/dashboard/guests");
}
