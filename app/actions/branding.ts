"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateWhiteLabel(formData: FormData) {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("Not authenticated");
  }

  const brandName = String(formData.get("brand_name") || "");
  const customDomain = String(formData.get("custom_domain") || "");
  let logoUrl = String(formData.get("existing_logo") || "");

  const logoFile = formData.get("logo");
  if (logoFile instanceof File && logoFile.name) {
    const path = `${userData.user.id}/${Date.now()}-${logoFile.name}`;
    const { error: uploadError } = await supabase.storage.from("white-label").upload(path, logoFile, { upsert: true });
    if (uploadError) {
      throw new Error(uploadError.message);
    }
    logoUrl = supabase.storage.from("white-label").getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase
    .from("white_label_settings")
    .upsert({
      user_id: userData.user.id,
      brand_name: brandName,
      custom_domain: customDomain,
      logo_url: logoUrl || null
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/white-label");
}
