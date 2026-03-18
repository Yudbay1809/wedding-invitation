"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BuilderSectionCollapsible } from "@/components/ui/BuilderSectionCollapsible";
import { ThemeSelector } from "@/components/ui/ThemeSelector";
import { Button } from "@/components/ui/Button";
import { saveInvitationBuilderWithFeedback } from "@/app/actions/builder";
import { useFormState } from "react-dom";
import { PLAN_FEATURES } from "@/lib/plans";
import Link from "next/link";

const AUTOSAVE_DELAY = 1200;

type InvitationBuilderFormProps = {
  invitationId: string;
  plan: "free" | "premium" | "business";
  disabledThemes: string[];
  themeLocked?: boolean;
  invitation: {
    title: string | null;
    slug: string | null;
    status: string | null;
    theme: string | null;
    cover_image_url: string | null;
    opening_quote: string | null;
    closing_message: string | null;
    wedding_hashtag: string | null;
    livestream_link: string | null;
    background_music: string | null;
    enable_rsvp: boolean | null;
    max_guests: number | null;
    rsvp_deadline: string | null;
    accent_color: string | null;
    preview_link: string | null;
    show_watermark: boolean | null;
  };
  couple: {
    bride_name: string | null;
    groom_name: string | null;
    bride_parents: string | null;
    groom_parents: string | null;
    bride_photo_url?: string | null;
    groom_photo_url?: string | null;
    love_story: string | null;
  } | null;
  event: {
    akad_date: string | null;
    akad_time: string | null;
    akad_venue: string | null;
    reception_date: string | null;
    reception_time: string | null;
    reception_venue: string | null;
    maps_link: string | null;
  } | null;
  gallery: { id: string; image_url: string | null; position: number | null }[];
  gift: {
    bank_name: string | null;
    account_number: string | null;
    account_holder: string | null;
    wallet_name: string | null;
    wallet_number: string | null;
  } | null;
};

type ValidationErrors = Partial<Record<"title" | "slug" | "akad_date" | "reception_date", string>>;

export function InvitationBuilderForm({
  invitationId,
  plan,
  disabledThemes,
  themeLocked = false,
  invitation,
  couple,
  event,
  gallery,
  gift
}: InvitationBuilderFormProps) {
  const autosaveAction = useCallback(
    (prevState: { ok: boolean; message: string }, formData: FormData) =>
      saveInvitationBuilderWithFeedback(invitationId, prevState, formData),
    [invitationId]
  );
  const [state, formAction] = useFormState(autosaveAction, { ok: true, message: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [changeTick, setChangeTick] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((formData: FormData) => {
    const nextErrors: ValidationErrors = {};
    const title = String(formData.get("title") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const akadDate = String(formData.get("akad_date") || "").trim();
    const receptionDate = String(formData.get("reception_date") || "").trim();

    if (!title) nextErrors.title = "Judul wajib diisi.";
    if (!slug) {
      nextErrors.slug = "Slug wajib diisi.";
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      nextErrors.slug = "Gunakan huruf kecil, angka, dan tanda hubung.";
    }
    if (!akadDate) nextErrors.akad_date = "Tanggal akad wajib diisi.";
    if (!receptionDate) nextErrors.reception_date = "Tanggal resepsi wajib diisi.";

    setErrors(nextErrors);
    return nextErrors;
  }, []);

  useEffect(() => {
    if (!changeTick) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      if (!formRef.current) return;
      setAutosaveStatus("saving");
      const formData = new FormData(formRef.current);
      formData.set("autosave", "true");
      const validation = validate(formData);
      if (Object.keys(validation).length > 0) {
        setAutosaveStatus("error");
        setToast({ message: "Lengkapi field wajib sebelum autosave.", tone: "error" });
        return;
      }
      const result = await autosaveAction({ ok: true, message: "" }, formData);
      if (result.ok) {
        setAutosaveStatus("saved");
        const timestamp = new Date();
        setLastSavedAt(timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
        setToast({ message: "Autosave tersimpan", tone: "success" });
      } else {
        setAutosaveStatus("error");
        setToast({ message: "Autosave gagal", tone: "error" });
      }
    }, AUTOSAVE_DELAY);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [autosaveAction, changeTick, validate]);

  useEffect(() => {
    if (!state.message) return;
    if (!state.ok) {
      setAutosaveStatus("error");
      setToast({ message: state.message, tone: "error" });
    } else {
      setToast({ message: state.message, tone: "success" });
    }
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2400);
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [toast]);

  const statusLabel =
    autosaveStatus === "saving"
      ? "Menyimpan otomatis..."
      : autosaveStatus === "saved"
        ? `Autosave${lastSavedAt ? ` - ${lastSavedAt}` : ""}`
      : autosaveStatus === "error"
        ? "Gagal autosave"
        : "";

  const showWatermark = invitation.show_watermark ?? true;
  const allowRemoveWatermark = PLAN_FEATURES[plan].noWatermark;
  const previewSlug = invitation.slug ?? "";
  const previewHref = previewSlug ? `/invite/${previewSlug}` : "#";
  const statusLabelText = invitation.status === "published" ? "Published" : "Draft";
  const sectionItems = [
    { id: "basic-info", label: "Basic Info" },
    { id: "couple-info", label: "Couple Info" },
    { id: "event-details", label: "Event Details" },
    { id: "additional-content", label: "Additional Content" },
    { id: "gallery", label: "Gallery" },
    { id: "rsvp-settings", label: "RSVP Settings" },
    { id: "digital-gift", label: "Digital Gift" },
    { id: "theme-settings", label: "Theme Settings" },
    { id: "branding", label: "Branding" },
    { id: "publish-settings", label: "Publish Settings" }
  ];

  return (
    <form
      ref={formRef}
      className="grid gap-6"
      action={formAction}
      encType="multipart/form-data"
      onChange={() => setChangeTick(Date.now())}
      onSubmit={(event) => {
        if (!formRef.current) return;
        const validation = validate(new FormData(formRef.current));
        if (Object.keys(validation).length > 0) {
          event.preventDefault();
          setToast({ message: "Periksa field wajib terlebih dahulu.", tone: "error" });
        }
      }}
    >
      {toast ? (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`rounded-2xl border px-4 py-3 text-sm shadow-lift ${
              toast.tone === "success"
                ? "border-emerald/30 bg-emerald/10 text-emerald"
                : "border-rose-200 bg-rose-50 text-rose-600"
            }`}
          >
            {toast.message}
            {toast.tone === "success" && lastSavedAt ? (
              <span className="ml-2 text-xs text-emerald/70">- {lastSavedAt}</span>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Invitation Builder</h2>
          <p className="text-sm text-ink/60">ID: {invitationId}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-ink/60">
          <span className="rounded-full border border-black/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em]">
            {statusLabelText}
          </span>
          <a
            href={previewHref}
            className={`rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] ${
              previewSlug ? "border-ink text-ink hover:bg-ink hover:text-white" : "border-black/10 text-ink/40 pointer-events-none"
            }`}
          >
            Preview
          </a>
          <a href="#publish-settings" className="rounded-full border border-black/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] hover:bg-sand">
            Publish
          </a>
          {statusLabel ? <span className="text-ink/60">{statusLabel}</span> : null}
        </div>
      </div>

      {state.message ? (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${state.ok ? "border-emerald/30 bg-emerald/10 text-emerald" : "border-rose-200 bg-rose-50 text-rose-600"}`}>
          {state.message}
        </div>
      ) : null}

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-2 text-sm">
            {sectionItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="block rounded-full px-3 py-2 text-graphite hover:bg-sand hover:text-ink">
                {item.label}
              </a>
            ))}
          </div>
        </aside>
        <div className="lg:hidden sticky top-20 z-10 -mx-4 px-4 py-2 bg-sand/80 backdrop-blur border-y border-black/5">
          <div className="flex gap-2 overflow-x-auto text-xs">
            {sectionItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="whitespace-nowrap rounded-full border border-black/10 px-3 py-1 text-graphite hover:bg-white">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-6">
          <BuilderSectionCollapsible id="basic-info" title="Basic Info" description="Judul, slug, dan status undangan.">
            <div className="grid gap-2">
              <input name="title" placeholder="Invitation title" defaultValue={invitation.title ?? ""} className="rounded-xl border border-black/10 px-4 py-3" required />
              {errors.title ? <span className="text-xs text-rose-600">{errors.title}</span> : null}
            </div>
            <div className="grid gap-2">
              <input name="slug" placeholder="Slug" defaultValue={invitation.slug ?? ""} className="rounded-xl border border-black/10 px-4 py-3" required />
              {errors.slug ? <span className="text-xs text-rose-600">{errors.slug}</span> : <span className="text-xs text-graphite">Contoh: raisa-dimas</span>}
            </div>
            <select name="status" className="rounded-xl border border-black/10 px-4 py-3" defaultValue={invitation.status ?? "draft"}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <input type="hidden" name="existing_cover_image" value={invitation.cover_image_url ?? ""} />
            <div className="grid gap-3">
              <label className="text-sm text-ink/60">Cover Image</label>
              <input name="cover_image" type="file" className="rounded-xl border border-black/10 px-4 py-3" />
              {invitation.cover_image_url ? (
                <div className="h-32 rounded-xl bg-[#f3f4f6]" style={{ backgroundImage: `url(${invitation.cover_image_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              ) : null}
            </div>
          </BuilderSectionCollapsible>

          <BuilderSectionCollapsible id="couple-info" title="Couple Info" description="Data pasangan dan love story.">
            <input name="bride_name" placeholder="Bride name" defaultValue={couple?.bride_name ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            <input name="groom_name" placeholder="Groom name" defaultValue={couple?.groom_name ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            <input name="bride_parents" placeholder="Bride parents" defaultValue={couple?.bride_parents ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            <input name="groom_parents" placeholder="Groom parents" defaultValue={couple?.groom_parents ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            <input type="hidden" name="existing_bride_photo" value={couple?.bride_photo_url ?? ""} />
            <input type="hidden" name="existing_groom_photo" value={couple?.groom_photo_url ?? ""} />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm text-ink/60">Bride photo</label>
                <input name="bride_photo" type="file" className="rounded-xl border border-black/10 px-4 py-3" />
                {couple?.bride_photo_url ? (
                  <div className="h-32 rounded-xl bg-[#f3f4f6]" style={{ backgroundImage: `url(${couple.bride_photo_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                ) : null}
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-ink/60">Groom photo</label>
                <input name="groom_photo" type="file" className="rounded-xl border border-black/10 px-4 py-3" />
                {couple?.groom_photo_url ? (
                  <div className="h-32 rounded-xl bg-[#f3f4f6]" style={{ backgroundImage: `url(${couple.groom_photo_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                ) : null}
              </div>
            </div>
            <textarea name="love_story" placeholder="Love story" defaultValue={couple?.love_story ?? ""} className="rounded-xl border border-black/10 px-4 py-3" rows={4} />
          </BuilderSectionCollapsible>

          <BuilderSectionCollapsible id="event-details" title="Event Details" description="Detail akad dan resepsi.">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <input name="akad_date" type="date" defaultValue={event?.akad_date ?? ""} className="rounded-xl border border-black/10 px-4 py-3" required />
                {errors.akad_date ? <span className="text-xs text-rose-600">{errors.akad_date}</span> : null}
              </div>
              <input name="akad_time" type="time" defaultValue={event?.akad_time ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            </div>
            <input name="akad_venue" placeholder="Akad venue" defaultValue={event?.akad_venue ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            <div className="grid md:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <input name="reception_date" type="date" defaultValue={event?.reception_date ?? ""} className="rounded-xl border border-black/10 px-4 py-3" required />
                {errors.reception_date ? <span className="text-xs text-rose-600">{errors.reception_date}</span> : null}
              </div>
              <input name="reception_time" type="time" defaultValue={event?.reception_time ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            </div>
            <input name="reception_venue" placeholder="Reception venue" defaultValue={event?.reception_venue ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            <input name="maps_link" placeholder="Maps link" defaultValue={event?.maps_link ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
          </BuilderSectionCollapsible>

          <BuilderSectionCollapsible id="additional-content" title="Additional Content" description="Quote, hashtag, livestream, dan musik.">
            <textarea name="opening_quote" placeholder="Opening quote" defaultValue={invitation.opening_quote ?? ""} className="rounded-xl border border-black/10 px-4 py-3" rows={2} />
            <textarea name="closing_message" placeholder="Closing message" defaultValue={invitation.closing_message ?? ""} className="rounded-xl border border-black/10 px-4 py-3" rows={2} />
            <input name="wedding_hashtag" placeholder="Wedding hashtag" defaultValue={invitation.wedding_hashtag ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            <input name="livestream_link" placeholder="Livestream link" defaultValue={invitation.livestream_link ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            <input name="background_music" placeholder="Background music URL" defaultValue={invitation.background_music ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
          </BuilderSectionCollapsible>

          <BuilderSectionCollapsible id="gallery" title="Gallery" description="Upload foto dan atur urutan.">
            <input name="gallery_files" type="file" multiple className="rounded-xl border border-black/10 px-4 py-3" />
            <div className="grid md:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="card p-3 flex flex-col gap-3">
                  <div className="h-24 rounded-xl bg-[#f3f4f6]" style={{ backgroundImage: item.image_url ? `url(${item.image_url})` : undefined, backgroundSize: "cover" }} />
                  <input type="hidden" name="gallery_id" value={item.id} />
                  <label className="text-xs text-ink/60">Position</label>
                  <input name="gallery_position" type="number" defaultValue={item.position ?? 0} className="rounded-xl border border-black/10 px-3 py-2 text-sm" />
                  <label className="flex items-center gap-2 text-xs text-ink/60">
                    <input type="checkbox" name="gallery_remove" value={item.id} />
                    Remove
                  </label>
                </div>
              ))}
            </div>
          </BuilderSectionCollapsible>

          <BuilderSectionCollapsible id="rsvp-settings" title="RSVP Settings" description="Atur RSVP tamu.">
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="enable_rsvp" defaultChecked={invitation.enable_rsvp ?? true} />
              Enable RSVP
            </label>
            <input name="max_guests" type="number" placeholder="Max guests" defaultValue={invitation.max_guests ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            <input name="deadline" type="date" defaultValue={invitation.rsvp_deadline ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
          </BuilderSectionCollapsible>

          <BuilderSectionCollapsible id="digital-gift" title="Digital Gift" description={PLAN_FEATURES[plan].digitalGift ? "Amplop digital untuk tamu." : "Upgrade ke Premium untuk fitur amplop digital."}>
            <input name="bank_name" placeholder="Bank name" defaultValue={gift?.bank_name ?? ""} className="rounded-xl border border-black/10 px-4 py-3" disabled={!PLAN_FEATURES[plan].digitalGift} />
            <input name="account_number" placeholder="Account number" defaultValue={gift?.account_number ?? ""} className="rounded-xl border border-black/10 px-4 py-3" disabled={!PLAN_FEATURES[plan].digitalGift} />
            <input name="account_holder" placeholder="Account holder" defaultValue={gift?.account_holder ?? ""} className="rounded-xl border border-black/10 px-4 py-3" disabled={!PLAN_FEATURES[plan].digitalGift} />
            <input name="wallet_name" placeholder="Wallet name" defaultValue={gift?.wallet_name ?? ""} className="rounded-xl border border-black/10 px-4 py-3" disabled={!PLAN_FEATURES[plan].digitalGift} />
            <input name="wallet_number" placeholder="Wallet number" defaultValue={gift?.wallet_number ?? ""} className="rounded-xl border border-black/10 px-4 py-3" disabled={!PLAN_FEATURES[plan].digitalGift} />
          </BuilderSectionCollapsible>

          <BuilderSectionCollapsible
            id="theme-settings"
            title="Theme Settings"
            description={themeLocked ? "Tema dikunci oleh admin sesuai transaksi." : "Pilih tema sesuai kebutuhan."}
          >
            <ThemeSelector value={invitation.theme ?? "classic"} disabledIds={disabledThemes} />
            {themeLocked ? <input type="hidden" name="theme" value={invitation.theme ?? "classic"} /> : null}
            <input name="accent_color" type="color" className="h-12 w-24 rounded-xl border border-black/10" defaultValue={invitation.accent_color ?? "#c49b3a"} />
          </BuilderSectionCollapsible>

          <BuilderSectionCollapsible id="branding" title="Branding" description={allowRemoveWatermark ? "Atur watermark di undangan publik." : "Upgrade untuk menghapus watermark."}>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="show_watermark"
                defaultChecked={showWatermark}
                disabled={!allowRemoveWatermark}
              />
              Tampilkan watermark WedSaaS
            </label>
            {!allowRemoveWatermark ? (
              <input type="hidden" name="show_watermark" value="true" />
            ) : null}
          </BuilderSectionCollapsible>

          <BuilderSectionCollapsible id="publish-settings" title="Publish Settings" description="Preview dan publish undangan.">
            <div className="grid gap-2 text-sm text-graphite">
              <span>Status saat ini: <span className="font-semibold text-ink">{statusLabelText}</span></span>
              {previewSlug ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs">Preview link:</span>
                  <Link href={previewHref} className="text-xs text-ocean">{previewHref}</Link>
                </div>
              ) : null}
            </div>
            <input name="preview_link" placeholder="Preview link" defaultValue={invitation.preview_link ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="publish" defaultChecked={invitation.status === "published"} />
              Publish sekarang
            </label>
          </BuilderSectionCollapsible>

          <Button type="submit">Save Changes</Button>
        </div>
      </div>
    </form>
  );
}
