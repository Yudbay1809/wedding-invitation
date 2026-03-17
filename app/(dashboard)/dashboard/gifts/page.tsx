import { BuilderSection } from "@/components/ui/BuilderSection";
import { Button } from "@/components/ui/Button";
import { getUserPlan } from "@/lib/subscription";
import { PLAN_FEATURES } from "@/lib/plans";

export default async function DigitalGiftSettingsPage() {
  const { plan } = await getUserPlan();

  if (!PLAN_FEATURES[plan].digitalGift) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold">Digital Gift Settings</h2>
        <p className="text-sm text-ink/60">Upgrade ke Premium untuk mengaktifkan amplop digital.</p>
      </div>
    );
  }

  return (
    <form className="grid gap-6">
      <BuilderSection title="Digital Gift Settings" description="Atur rekening bank atau e-wallet. (Kelola per undangan di Builder)">
        <input name="bank_name" placeholder="Bank name" className="rounded-xl border border-black/10 px-4 py-3" />
        <input name="account_number" placeholder="Account number" className="rounded-xl border border-black/10 px-4 py-3" />
        <input name="account_holder" placeholder="Account holder" className="rounded-xl border border-black/10 px-4 py-3" />
        <input name="wallet_name" placeholder="Wallet name" className="rounded-xl border border-black/10 px-4 py-3" />
        <input name="wallet_number" placeholder="Wallet number" className="rounded-xl border border-black/10 px-4 py-3" />
      </BuilderSection>
      <Button type="submit">Simpan</Button>
    </form>
  );
}
