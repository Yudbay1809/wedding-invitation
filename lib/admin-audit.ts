import { requireAdmin } from "@/lib/subscription";

export type AdminAuditPayload = {
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function logAdminActivity(payload: AdminAuditPayload) {
  const { supabase, userId } = await requireAdmin();
  const { action, targetType, targetId, metadata } = payload;

  await supabase.from("admin_activity").insert({
    actor_id: userId,
    action,
    target_type: targetType,
    target_id: targetId ?? null,
    metadata: metadata ?? {}
  });
}
