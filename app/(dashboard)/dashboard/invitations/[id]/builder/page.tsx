import { InvitationBuilderForm } from "@/components/dashboard/InvitationBuilderForm";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscription";
import { ALL_THEMES, THEME_ACCESS } from "@/lib/plans";
import { notFound } from "next/navigation";

export default async function InvitationBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const { plan } = await getUserPlan();
  const resolvedParams = await params;

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, title, slug, status, theme, theme_locked, cover_image_url, opening_quote, closing_message, wedding_hashtag, livestream_link, background_music, enable_rsvp, max_guests, rsvp_deadline, accent_color, preview_link, show_watermark")
    .eq("id", resolvedParams.id)
    .single();
  if (!invitation) {
    notFound();
  }

  const { data: couple } = await supabase
    .from("invitation_couples")
    .select("bride_name, groom_name, bride_parents, groom_parents, bride_photo_url, groom_photo_url, love_story")
    .eq("invitation_id", resolvedParams.id)
    .single();

  const { data: event } = await supabase
    .from("invitation_events")
    .select("akad_date, akad_time, akad_venue, reception_date, reception_time, reception_venue, maps_link")
    .eq("invitation_id", resolvedParams.id)
    .single();

  const { data: gallery } = await supabase
    .from("invitation_gallery")
    .select("id, image_url, position")
    .eq("invitation_id", resolvedParams.id)
    .order("position");

  const { data: gift } = await supabase
    .from("gift_accounts")
    .select("bank_name, account_number, account_holder, wallet_name, wallet_number")
    .eq("invitation_id", resolvedParams.id)
    .single();

  const allowedThemes = THEME_ACCESS[plan];
  const disabledThemes = invitation.theme_locked
    ? ALL_THEMES
    : ALL_THEMES.filter((theme) => !allowedThemes.includes(theme));

  return (
    <InvitationBuilderForm
      invitationId={resolvedParams.id}
      plan={plan}
      disabledThemes={disabledThemes}
      themeLocked={Boolean(invitation.theme_locked)}
      invitation={invitation}
      couple={couple}
      event={event}
      gallery={gallery ?? []}
      gift={gift}
    />
  );
}
