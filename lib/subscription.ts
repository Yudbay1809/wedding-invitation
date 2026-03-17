import { createServerSupabase } from "@/lib/supabase/server";
import type { Plan } from "@/lib/plans";

export async function getUserPlan() {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { plan: "free" as Plan, userId: null };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", userData.user.id)
    .single();

  const plan = (subscription?.plan ?? "free") as Plan;
  return { plan, userId: userData.user.id };
}

export async function requireAdmin() {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("Not authenticated");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return { supabase, userId: userData.user.id };
}
