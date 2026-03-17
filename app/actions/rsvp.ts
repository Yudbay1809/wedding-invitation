"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function submitRsvp(invitationId: string, formData: FormData) {
  const supabase = await createServerSupabase();
  const guestToken = String(formData.get("guest_token") || "").trim();
  let name = String(formData.get("name") || "").trim();
  let guestId: string | null = null;
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const guestCount = Number(formData.get("guest_count"));
  const status = String(formData.get("status") || "pending");
  if (!whatsapp || !guestCount || guestCount < 1) {
    throw new Error("Data RSVP tidak lengkap.");
  }

  if (guestToken) {
    const { data: guestRows } = await supabase.rpc("get_guest_by_token", {
      p_invitation_id: invitationId,
      p_token: guestToken
    });
    const guest = Array.isArray(guestRows) ? guestRows[0] : null;
    if (!guest?.name || !guest?.id) {
      throw new Error("Undangan tamu tidak valid.");
    }
    name = guest.name;
    guestId = guest.id;
    if (guest.max_guests && guestCount > Number(guest.max_guests)) {
      throw new Error(`Jumlah tamu maksimal ${guest.max_guests}.`);
    }
  }

  if (!name) {
    throw new Error("Nama tamu diperlukan.");
  }

  const payload = {
    invitation_id: invitationId,
    name,
    guest_id: guestId,
    whatsapp,
    guest_count: guestCount,
    status,
    message: String(formData.get("message") || "")
  };

  const { error } = await supabase.from("rsvps").insert(payload);
  if (error) {
    throw new Error(error.message);
  }
}

export async function submitRsvpWithFeedback(invitationId: string, prevState: { ok: boolean; message: string }, formData: FormData) {
  try {
    await submitRsvp(invitationId, formData);
    return { ok: true, message: "RSVP terkirim. Terima kasih." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Gagal mengirim RSVP." };
  }
}
