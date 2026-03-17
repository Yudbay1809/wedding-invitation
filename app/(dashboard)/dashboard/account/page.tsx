import { BuilderSection } from "@/components/ui/BuilderSection";
import { Button } from "@/components/ui/Button";

export default function AccountSettingsPage() {
  return (
    <form className="grid gap-6">
      <BuilderSection title="Account Settings" description="Update informasi akun.">
        <input name="full_name" placeholder="Full name" className="rounded-xl border border-black/10 px-4 py-3" />
        <input name="phone" placeholder="Phone number" className="rounded-xl border border-black/10 px-4 py-3" />
      </BuilderSection>
      <Button type="submit">Update</Button>
    </form>
  );
}
