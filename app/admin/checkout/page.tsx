import { createServerSupabase } from "@/lib/supabase/server";
import { AdminCheckoutForm } from "@/components/admin/AdminCheckoutForm";

export default async function AdminCheckoutPage() {
  const supabase = await createServerSupabase();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, username")
    .order("created_at", { ascending: false });

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">Admin Checkout</h2>
        <p className="text-sm text-ink/60">Buat undangan dari transaksi dan lock tema.</p>
      </div>

      <div className="surface p-6">
        <AdminCheckoutForm profiles={profiles ?? []} />
      </div>
    </div>
  );
}
