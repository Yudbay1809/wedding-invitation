import { BuilderSection } from "@/components/ui/BuilderSection";
import { Button } from "@/components/ui/Button";
import { getUserPlan } from "@/lib/subscription";
import { PLAN_FEATURES } from "@/lib/plans";
import { createServerSupabase } from "@/lib/supabase/server";
import { updateWhiteLabel } from "@/app/actions/branding";

export default async function WhiteLabelPage() {
  const { plan } = await getUserPlan();

  if (!PLAN_FEATURES[plan].whiteLabel) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold">White Label</h2>
        <p className="text-sm text-ink/60">Fitur ini tersedia di paket Business.</p>
      </div>
    );
  }

  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  const { data: settings } = await supabase
    .from("white_label_settings")
    .select("brand_name, logo_url, custom_domain")
    .eq("user_id", userData.user?.id ?? "")
    .single();

  return (
    <form className="grid gap-6" action={updateWhiteLabel} encType="multipart/form-data">
      <BuilderSection title="White Label" description="Ganti branding sesuai kebutuhan. (Business)">
        <input name="brand_name" placeholder="Brand name" defaultValue={settings?.brand_name ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
        <input type="hidden" name="existing_logo" value={settings?.logo_url ?? ""} />
        <input name="logo" type="file" className="rounded-xl border border-black/10 px-4 py-3" />
        {settings?.logo_url ? (
          <div className="h-24 w-48 rounded-xl bg-[#f3f4f6]" style={{ backgroundImage: `url(${settings.logo_url})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
        ) : null}
        <input name="custom_domain" placeholder="Custom domain" defaultValue={settings?.custom_domain ?? ""} className="rounded-xl border border-black/10 px-4 py-3" />
      </BuilderSection>
      <Button type="submit">Simpan</Button>
    </form>
  );
}
