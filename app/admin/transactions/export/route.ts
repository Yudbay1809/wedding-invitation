import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, user_id, invitation_id, plan, addon_theme, amount, currency, status, created_at")
    .order("created_at", { ascending: false });

  const header = ["id", "user_id", "invitation_id", "plan", "addon_theme", "amount", "currency", "status", "created_at"];
  const rows = (transactions ?? []).map((row) => [
    row.id,
    row.user_id,
    row.invitation_id ?? "",
    row.plan ?? "",
    row.addon_theme ?? "",
    row.amount ?? 0,
    row.currency ?? "IDR",
    row.status ?? "paid",
    row.created_at ?? ""
  ]);

  const escapeCsv = (value: string | number | null) => {
    const stringValue = String(value ?? "");
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, "\"\"")}"`;
    }
    return stringValue;
  };

  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=\"transactions.csv\""
    }
  });
}
