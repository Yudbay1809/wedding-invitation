"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscription";
import { PLAN_FEATURES } from "@/lib/plans";
import { revalidatePath } from "next/cache";

const normalizeBoolean = (value: FormDataEntryValue | null) => value === "on" || value === "true";

export async function saveInvitationBuilder(invitationId: string, formData: FormData) {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("Not authenticated");
  }

  const { plan } = await getUserPlan();

  const title = String(formData.get("title") || "");
  const slug = String(formData.get("slug") || "");
  const statusInput = String(formData.get("status") || "draft");
  const themeInput = String(formData.get("theme") || "");
  const publish = normalizeBoolean(formData.get("publish"));
  const shouldPublish = publish || statusInput === "published";
  const { data: currentInvitation } = await supabase
    .from("invitations")
    .select("theme, theme_locked")
    .eq("id", invitationId)
    .eq("user_id", userData.user.id)
    .maybeSingle();
  const allowedThemes = ["classic", "minimal", "romantic", "luxury"];
  const currentTheme = currentInvitation?.theme ?? "classic";
  const themeLocked = currentInvitation?.theme_locked ?? false;
  const theme = themeLocked
    ? currentTheme
    : allowedThemes.includes(themeInput)
      ? themeInput
      : currentTheme;
  let coverImageUrl = String(formData.get("existing_cover_image") || "");
  const showWatermarkInput = normalizeBoolean(formData.get("show_watermark"));
  const showWatermark = PLAN_FEATURES[plan].noWatermark ? showWatermarkInput : true;

  const coverFile = formData.get("cover_image");
  if (coverFile instanceof File && coverFile.name) {
    const coverPath = `${userData.user.id}/${invitationId}/${Date.now()}-${coverFile.name}`;
    const { error: uploadError } = await supabase.storage.from("covers").upload(coverPath, coverFile, { upsert: true });
    if (uploadError) {
      throw new Error(uploadError.message);
    }
    coverImageUrl = supabase.storage.from("covers").getPublicUrl(coverPath).data.publicUrl;
  }

  if (!title || !slug) {
    throw new Error("Title dan slug wajib diisi.");
  }

  const invitationPayload = {
    title,
    slug,
    status: shouldPublish ? "published" : statusInput,
    theme,
    cover_image_url: coverImageUrl || null,
    opening_quote: String(formData.get("opening_quote") || ""),
    closing_message: String(formData.get("closing_message") || ""),
    wedding_hashtag: String(formData.get("wedding_hashtag") || ""),
    livestream_link: String(formData.get("livestream_link") || ""),
    background_music: String(formData.get("background_music") || ""),
    enable_rsvp: normalizeBoolean(formData.get("enable_rsvp")),
    max_guests: Number(formData.get("max_guests") || 0) || null,
    rsvp_deadline: String(formData.get("deadline") || "") || null,
    accent_color: String(formData.get("accent_color") || ""),
    preview_link: String(formData.get("preview_link") || ""),
    show_watermark: showWatermark,
    published_at: shouldPublish ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  };

  const { error: invitationError } = await supabase
    .from("invitations")
    .update(invitationPayload)
    .eq("id", invitationId)
    .eq("user_id", userData.user.id);

  if (invitationError) {
    throw new Error(invitationError.message);
  }

  const couplesPayload = {
    invitation_id: invitationId,
    bride_name: String(formData.get("bride_name") || ""),
    groom_name: String(formData.get("groom_name") || ""),
    bride_parents: String(formData.get("bride_parents") || ""),
    groom_parents: String(formData.get("groom_parents") || ""),
    love_story: String(formData.get("love_story") || "")
  };

  const eventsPayload = {
    invitation_id: invitationId,
    akad_date: String(formData.get("akad_date") || "") || null,
    akad_time: String(formData.get("akad_time") || "") || null,
    akad_venue: String(formData.get("akad_venue") || ""),
    reception_date: String(formData.get("reception_date") || "") || null,
    reception_time: String(formData.get("reception_time") || "") || null,
    reception_venue: String(formData.get("reception_venue") || ""),
    maps_link: String(formData.get("maps_link") || "")
  };

  const { error: couplesError } = await supabase.from("invitation_couples").upsert(couplesPayload);
  if (couplesError) {
    throw new Error(couplesError.message);
  }

  const { error: eventsError } = await supabase.from("invitation_events").upsert(eventsPayload);
  if (eventsError) {
    throw new Error(eventsError.message);
  }

  if (PLAN_FEATURES[plan].digitalGift) {
    const giftPayload = {
      invitation_id: invitationId,
      bank_name: String(formData.get("bank_name") || ""),
      account_number: String(formData.get("account_number") || ""),
      account_holder: String(formData.get("account_holder") || ""),
      wallet_name: String(formData.get("wallet_name") || ""),
      wallet_number: String(formData.get("wallet_number") || "")
    };

    const { error: giftError } = await supabase.from("gift_accounts").upsert(giftPayload);
    if (giftError) {
      throw new Error(giftError.message);
    }
  }

  const removeIds = formData.getAll("gallery_remove").map(String);
  if (removeIds.length > 0) {
    const { error: deleteError } = await supabase.from("invitation_gallery").delete().in("id", removeIds);
    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  const existingIds = formData.getAll("gallery_id").map(String);
  const existingPositions = formData.getAll("gallery_position").map((value) => Number(value));

  for (let i = 0; i < existingIds.length; i += 1) {
    const id = existingIds[i];
    if (!id || removeIds.includes(id)) continue;
    const position = existingPositions[i] ?? i + 1;
    await supabase.from("invitation_gallery").update({ position }).eq("id", id);
  }

  const files = formData.getAll("gallery_files").filter((file) => file instanceof File) as File[];
  if (files.length > 0) {
    const { data: lastItem } = await supabase
      .from("invitation_gallery")
      .select("position")
      .eq("invitation_id", invitationId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    let position = (lastItem?.position ?? 0) + 1;
    for (const file of files) {
      if (!file.name) continue;
      const path = `${userData.user.id}/${invitationId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file, { upsert: false });
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      const publicUrl = supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;
      const { error: insertError } = await supabase.from("invitation_gallery").insert({
        invitation_id: invitationId,
        image_url: publicUrl,
        position
      });
      if (insertError) {
        throw new Error(insertError.message);
      }
      position += 1;
    }
  }

  revalidatePath(`/dashboard/invitations/${invitationId}/builder`);
  revalidatePath(`/invite/${slug}`);
}

export async function saveInvitationBuilderWithFeedback(
  invitationId: string,
  prevState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    const autosave = normalizeBoolean(formData.get("autosave"));
    await saveInvitationBuilder(invitationId, formData);
    return { ok: true, message: autosave ? "Autosaved" : "Perubahan tersimpan." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Gagal menyimpan." };
  }
}
