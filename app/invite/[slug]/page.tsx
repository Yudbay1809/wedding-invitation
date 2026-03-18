import { createServerSupabase } from "@/lib/supabase/server";
import { RSVPForm } from "@/components/ui/RSVPForm";
import { GuestMessageForm } from "@/components/ui/GuestMessageForm";
import { GiftCard } from "@/components/ui/GiftCard";
import { submitRsvpWithFeedback } from "@/app/actions/rsvp";
import { submitGuestMessageWithFeedback } from "@/app/actions/messages";
import { confirmGiftWithFeedback } from "@/app/actions/gifts";
import { notFound } from "next/navigation";
import { GiftConfirmForm } from "@/components/ui/GiftConfirmForm";
import { CalendarDays, MapPin, Heart, Sparkles } from "lucide-react";
import { Parallax } from "@/components/invitation/Parallax";
import { InviteSection, InviteStagger, InviteStaggerItem } from "@/components/invitation/InviteMotion";
import { Countdown } from "@/components/invitation/Countdown";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { FloatingOrnament } from "@/components/invitation/FloatingOrnament";
import { FloralParallaxLayer } from "@/components/invitation/FloralParallaxLayer";
import { GalleryLightbox } from "@/components/invitation/GalleryLightbox";
import { EnvelopeReveal } from "@/components/invitation/EnvelopeReveal";
import { TypewriterText } from "@/components/invitation/TypewriterText";
import { SparkleLink } from "@/components/invitation/SparkleLink";
import { FadeParallax } from "@/components/invitation/FadeParallax";
import { MapReveal } from "@/components/invitation/MapReveal";

const themeClassMap: Record<string, string> = {
  classic: "theme-classic",
  minimal: "theme-minimal",
  romantic: "theme-romantic",
  luxury: "theme-luxury",
  boho: "theme-boho",
  garden: "theme-garden",
  modern: "theme-modern",
  celestial: "theme-celestial"
};

const themeLayout = {
  classic: {
    heroAlign: "items-center text-center",
    sectionGrid: "grid gap-6",
    card: "surface p-6"
  },
  minimal: {
    heroAlign: "items-start text-left",
    sectionGrid: "grid md:grid-cols-2 gap-6",
    card: "surface p-6"
  },
  romantic: {
    heroAlign: "items-center text-center",
    sectionGrid: "grid gap-6",
    card: "surface p-6"
  },
  luxury: {
    heroAlign: "items-center text-center",
    sectionGrid: "grid gap-6",
    card: "surface p-6"
  },
  boho: {
    heroAlign: "items-start text-left",
    sectionGrid: "grid md:grid-cols-2 gap-6",
    card: "surface p-6"
  },
  garden: {
    heroAlign: "items-start text-left",
    sectionGrid: "grid md:grid-cols-2 gap-6",
    card: "surface p-6"
  },
  modern: {
    heroAlign: "items-start text-left",
    sectionGrid: "grid gap-6",
    card: "surface p-6"
  },
  celestial: {
    heroAlign: "items-center text-center",
    sectionGrid: "grid gap-6",
    card: "surface p-6"
  }
} as const;

const fallbackGallery = [
  "/assets/gallery-1.jpg",
  "/assets/gallery-2.jpg",
  "/assets/gallery-3.jpg"
];

export default async function InvitePage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string; guest?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const guestToken = resolvedSearchParams.guest ? decodeURIComponent(resolvedSearchParams.guest).trim() : "";
  const fallbackGuestName = resolvedSearchParams.to
    ? decodeURIComponent(resolvedSearchParams.to).replace(/\+/g, " ").trim()
    : "";
  const supabase = await createServerSupabase();

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, title, slug, theme, published_at, enable_rsvp, cover_image_url, background_music, show_watermark, opening_quote")
    .eq("slug", slug)
    .single();
  if (!invitation) {
    notFound();
  }

  let guestName = fallbackGuestName;
  let guestTokenResolved = "";
  if (guestToken) {
    const { data: guestRows } = await supabase.rpc("get_guest_by_token", {
      p_invitation_id: invitation.id,
      p_token: guestToken
    });
    const guest = Array.isArray(guestRows) ? guestRows[0] : null;
    if (guest?.name) {
      guestName = guest.name;
      guestTokenResolved = guestToken;
    }
  }

  await supabase.from("invitation_views").insert({
    invitation_id: invitation.id
  });

  const { data: couple } = await supabase
    .from("invitation_couples")
    .select("bride_name, groom_name, bride_photo_url, groom_photo_url, love_story")
    .eq("invitation_id", invitation?.id ?? "")
    .single();

  const { data: event } = await supabase
    .from("invitation_events")
    .select("akad_date, akad_time, akad_venue, reception_date, reception_time, reception_venue, maps_link")
    .eq("invitation_id", invitation?.id ?? "")
    .single();

  const { data: gallery } = await supabase
    .from("invitation_gallery")
    .select("image_url")
    .eq("invitation_id", invitation?.id ?? "")
    .order("position");

  const { data: gift } = await supabase
    .from("gift_accounts")
    .select("bank_name, account_number, account_holder, wallet_name, wallet_number")
    .eq("invitation_id", invitation?.id ?? "")
    .single();

  const themeClass = themeClassMap[invitation.theme] ?? "theme-classic";
  const layout = themeLayout[invitation.theme as keyof typeof themeLayout] ?? themeLayout.classic;

  const eventCards = (
    <InviteStagger>
      <div className={layout.sectionGrid}>
        {[{ label: "Akad", date: event?.akad_date, time: event?.akad_time, venue: event?.akad_venue },
          { label: "Resepsi", date: event?.reception_date, time: event?.reception_time, venue: event?.reception_venue }].map((item) => (
          <InviteStaggerItem key={item.label}>
            <div className={layout.card}>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-graphite" />
                <h3 className="text-lg font-semibold">{item.label}</h3>
              </div>
              <p className="text-sm text-graphite mt-2">{item.date ?? "21 Juni 2026"} - {item.time ?? "09:00"}</p>
              <div className="flex items-center gap-2 text-sm text-graphite mt-2">
                <MapPin className="h-4 w-4" />
                <span>{item.venue ?? "Gedung Serbaguna"}</span>
              </div>
              {item.label === "Resepsi" && event?.maps_link ? (
                <a className="text-sm text-ocean mt-3 inline-flex items-center gap-2" href={event.maps_link}>
                  <MapPin className="h-4 w-4" />
                  Lihat Maps
                </a>
              ) : null}
            </div>
          </InviteStaggerItem>
        ))}
      </div>
    </InviteStagger>
  );

  const eventSection = invitation.theme === "luxury" ? (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
        <div className="rounded-3xl h-72 bg-[#111827] relative overflow-hidden">
          {invitation?.cover_image_url ? (
            <Parallax strength={50}>
              <div className="absolute inset-0" style={{ backgroundImage: `url(${invitation.cover_image_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            </Parallax>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Luxury Celebration</p>
            <h3 className="text-2xl font-semibold mt-2">{couple?.bride_name ?? "Raisa"} & {couple?.groom_name ?? "Dimas"}</h3>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="floating-card p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber" />
              <h3 className="text-lg font-semibold">Akad</h3>
            </div>
            <p className="text-sm text-graphite mt-2">{event?.akad_date ?? "21 Juni 2026"} - {event?.akad_time ?? "09:00"}</p>
            <p className="text-sm text-graphite mt-2">{event?.akad_venue ?? "Gedung Serbaguna"}</p>
          </div>
          <div className="floating-card p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber" />
              <h3 className="text-lg font-semibold">Resepsi</h3>
            </div>
            <p className="text-sm text-graphite mt-2">{event?.reception_date ?? "21 Juni 2026"} - {event?.reception_time ?? "19:00"}</p>
            <p className="text-sm text-graphite mt-2">{event?.reception_venue ?? "Ballroom Hotel"}</p>
          </div>
          <div className="lux-divider" />
        </div>
      </div>
    </section>
  ) : (
    <section className={`max-w-4xl mx-auto px-6 py-12 ${layout.sectionGrid}`}>
      {eventCards}
    </section>
  );

  const storySection = (
    <InviteSection>
      <section className="max-w-4xl mx-auto px-6 py-12">
        <span className="pill pill-accent">Our Story</span>
        <h2 className="section-title mt-4">Kisah Kami</h2>
        {(couple?.bride_photo_url || couple?.groom_photo_url) ? (
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="surface p-4">
              <div className="h-56 rounded-2xl bg-[#f3f4f6]" style={{ backgroundImage: couple?.bride_photo_url ? `url(${couple.bride_photo_url})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
              <p className="mt-3 text-sm text-graphite">{couple?.bride_name ?? "Bride"}</p>
            </div>
            <div className="surface p-4">
              <div className="h-56 rounded-2xl bg-[#f3f4f6]" style={{ backgroundImage: couple?.groom_photo_url ? `url(${couple.groom_photo_url})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
              <p className="mt-3 text-sm text-graphite">{couple?.groom_name ?? "Groom"}</p>
            </div>
          </div>
        ) : null}
        <p className="muted mt-3">{couple?.love_story ?? "Sebuah kisah cinta yang tumbuh dari pertemuan sederhana, lalu menjadi janji seumur hidup."}</p>
      </section>
    </InviteSection>
  );

  const gallerySection = (
    <InviteSection>
      <section className="max-w-4xl mx-auto px-6 py-12">
        <span className="pill pill-accent">Gallery</span>
        <h2 className="section-title mt-4">Momen Spesial</h2>
        <GalleryLightbox images={gallery?.length ? gallery.map((item) => item.image_url) : fallbackGallery} />
      </section>
    </InviteSection>
  );

  const mapSection = event?.maps_link ? (
    <InviteSection>
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className={layout.card}>
          <h2 className="text-xl font-semibold">Lokasi Acara</h2>
          <p className="text-sm text-graphite mt-2">Klik peta untuk navigasi langsung.</p>
          <div className="mt-6">
            <MapReveal link={event.maps_link} />
          </div>
        </div>
      </section>
    </InviteSection>
  ) : null;

  const rsvpSection = (
    <InviteSection>
      <section id="rsvp" className="max-w-4xl mx-auto px-6 py-12 grid gap-6">
        {invitation?.enable_rsvp ? (
          <div className={layout.card}>
            <h2 className="text-xl font-semibold">RSVP</h2>
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
              <RSVPForm
                action={submitRsvpWithFeedback.bind(null, invitation?.id ?? "")}
                defaultName={guestName || undefined}
                lockName={Boolean(guestName)}
                hideName={Boolean(guestTokenResolved)}
                guestToken={guestTokenResolved || undefined}
              />
              <div className="surface p-6">
                <h3 className="text-lg font-semibold">Tips RSVP</h3>
                <ul className="mt-3 space-y-2 text-sm text-graphite">
                  <li>Konfirmasi sebelum H-3 acara.</li>
                  <li>Isi jumlah tamu sesuai undangan.</li>
                  <li>Jika berhalangan hadir, beri pesan singkat.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
        <div className={layout.card}>
          <h2 className="text-xl font-semibold">Ucapan</h2>
          <GuestMessageForm action={submitGuestMessageWithFeedback.bind(null, invitation?.id ?? "")} />
        </div>
      </section>
    </InviteSection>
  );

  const giftSection = gift ? (
    <InviteSection>
      <section className="max-w-4xl mx-auto px-6 py-12">
        <GiftCard
          bankName={gift?.bank_name}
          accountNumber={gift?.account_number}
          accountHolder={gift?.account_holder}
          walletName={gift?.wallet_name}
          walletNumber={gift?.wallet_number}
        />
        <div className="surface p-6 mt-6">
          <h3 className="text-lg font-semibold">Konfirmasi Amplop</h3>
          <GiftConfirmForm action={confirmGiftWithFeedback.bind(null, invitation?.id ?? "")} />
        </div>
      </section>
    </InviteSection>
  ) : null;

  const closingSection = (
    <InviteSection>
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <span className="pill pill-accent">Closing</span>
        <h2 className="section-title mt-4">Sampai bertemu di hari bahagia</h2>
        <p className="muted mt-3">
          {invitation?.closing_message ?? "Terima kasih atas doa, restu, dan kehadiranmu dalam cerita kami."}
        </p>
      </section>
    </InviteSection>
  );

  const sections = invitation.theme === "minimal"
    ? [eventSection, storySection, gallerySection, mapSection, rsvpSection, giftSection, closingSection]
    : invitation.theme === "romantic"
      ? [storySection, eventSection, gallerySection, mapSection, rsvpSection, giftSection, closingSection]
      : invitation.theme === "luxury"
        ? [eventSection, storySection, gallerySection, mapSection, rsvpSection, giftSection, closingSection]
        : [eventSection, storySection, gallerySection, mapSection, rsvpSection, giftSection, closingSection];

  return (
    <main className={`bg-sand text-ink ${themeClass}`}>
      <EnvelopeReveal
        title={couple?.bride_name && couple?.groom_name ? `${couple.bride_name} & ${couple.groom_name}` : "The Wedding"}
        subtitle={event?.akad_date ?? "Save the Date"}
      />
      <InviteSection>
        <FadeParallax>
          <section className={`min-h-screen px-6 py-16 gradient-hero ${layout.heroAlign} relative overflow-hidden`}>
            {invitation.theme === "romantic" ? (
              <>
                <FloatingOrnament className="absolute -top-24 -left-24 h-64 w-64 opacity-70" />
                <FloatingOrnament className="absolute -bottom-24 -right-24 h-64 w-64 opacity-50" />
                <FloralParallaxLayer />
              </>
            ) : null}
            {invitation.theme === "minimal" ? (
              <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
                <div className="flex flex-col gap-4">
                  <span className="pill pill-accent">The Wedding of</span>
                  <h1 className="text-4xl md:text-6xl font-semibold">
                    {couple?.bride_name ?? "Raisa"} & {couple?.groom_name ?? "Dimas"}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-graphite">
                    <Heart className="h-4 w-4" />
                    <span className="mono">{event?.akad_date ?? "21 Juni 2026"}</span>
                  </div>
                  <TypewriterText
                    className="text-sm text-graphite max-w-xl"
                    text={invitation.opening_quote ?? "Dengan penuh rasa syukur kami mengundangmu untuk menjadi bagian dari hari bahagia kami."}
                  />
                  {guestName ? (
                    <p className="text-sm bg-white px-4 py-2 rounded-full w-fit">Kepada Yth. {guestName}</p>
                  ) : null}
                </div>
                <div className="surface p-4">
                  <div className="h-64 rounded-2xl bg-[#f3f4f6]" style={{ backgroundImage: invitation?.cover_image_url ? `url(${invitation.cover_image_url})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <div className="mt-4 flex items-center justify-between text-xs text-graphite">
                    <span>Save the date</span>
                    <span className="mono">{event?.akad_date ?? "21 Juni 2026"}</span>
                  </div>
                </div>
              </div>
            ) : invitation.theme === "luxury" ? (
              <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-4">
                <span className="pill pill-accent">The Wedding of</span>
                <h1 className="text-4xl md:text-6xl font-semibold">
                  {couple?.bride_name ?? "Raisa"} & {couple?.groom_name ?? "Dimas"}
                </h1>
                <div className="lux-divider w-40" />
                <div className="flex items-center gap-3 text-sm text-graphite">
                  <Heart className="h-4 w-4" />
                  <span>{event?.akad_date ?? "21 Juni 2026"}</span>
                </div>
                <TypewriterText
                  className="text-sm text-graphite max-w-xl"
                  text={invitation.opening_quote ?? "Dengan penuh rasa syukur kami mengundangmu untuk menjadi bagian dari hari bahagia kami."}
                />
                {guestName ? (
                  <p className="text-sm bg-white px-4 py-2 rounded-full">Kepada Yth. {guestName}</p>
                ) : null}
                {invitation?.cover_image_url ? (
                  <Parallax strength={30}>
                    <div className="mt-6 h-64 w-full max-w-xl rounded-3xl bg-[#f3f4f6]" style={{ backgroundImage: `url(${invitation.cover_image_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  </Parallax>
                ) : null}
              </div>
            ) : (
              <div className={`flex flex-col justify-center ${layout.heroAlign}`}>
                <span className="pill pill-accent">The Wedding of</span>
                <h1 className="text-4xl md:text-6xl font-semibold mt-6">
                  {couple?.bride_name ?? "Raisa"} & {couple?.groom_name ?? "Dimas"}
                </h1>
                <div className="mt-4 flex items-center gap-3 text-sm text-graphite">
                  <Heart className="h-4 w-4" />
                  <span className={invitation.theme === "minimal" ? "mono" : ""}>{event?.akad_date ?? "21 Juni 2026"}</span>
                </div>
                <TypewriterText
                  className="mt-4 text-sm text-graphite max-w-xl"
                  text={invitation.opening_quote ?? "Dengan penuh rasa syukur kami mengundangmu untuk menjadi bagian dari hari bahagia kami."}
                />
                {guestName ? (
                  <p className="mt-6 text-sm bg-white px-4 py-2 rounded-full">Kepada Yth. {guestName}</p>
                ) : null}
                {invitation?.cover_image_url ? (
                  <Parallax strength={30}>
                    <div className="mt-8 h-60 w-full max-w-xl rounded-3xl bg-[#f3f4f6]" style={{ backgroundImage: `url(${invitation.cover_image_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  </Parallax>
                ) : null}
              </div>
            )}
          </section>
        </FadeParallax>
      </InviteSection>

      <InviteSection>
        <section className="max-w-4xl mx-auto px-6 py-6">
          <Countdown date={event?.akad_date ?? event?.reception_date ?? null} />
        </section>
      </InviteSection>

      <InviteSection>
        <section className="max-w-4xl mx-auto px-6 py-8">
          <div className="surface p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Konfirmasi Kehadiran</h3>
              <p className="text-sm text-graphite">Kami akan sangat senang jika kamu dapat hadir dan merayakan hari bahagia bersama.</p>
            </div>
            <SparkleLink href="#rsvp" className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
              Isi RSVP
            </SparkleLink>
          </div>
        </section>
      </InviteSection>

      {sections.map((section, index) => (
        <div key={index}>{section}</div>
      ))}

      {invitation?.background_music ? <MusicPlayer src={invitation.background_music} /> : null}

      {invitation?.enable_rsvp ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
          <SparkleLink
            href="#rsvp"
            className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-lift"
          >
            RSVP Sekarang
          </SparkleLink>
        </div>
      ) : null}

      {invitation?.show_watermark ? (
        <section className="pb-10 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-graphite">Powered by WedSaaS</span>
        </section>
      ) : null}
    </main>
  );
}
