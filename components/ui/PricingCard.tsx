import { Button } from "./Button";

export function PricingCard({
  title,
  price,
  features,
  highlight
}: {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div className={`surface p-6 flex flex-col gap-4 ${highlight ? "border-2 border-coral" : ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        {highlight ? <span className="text-xs uppercase tracking-[0.2em] text-coral">Popular</span> : null}
      </div>
      <p className="text-3xl font-semibold">{price}</p>
      <ul className="space-y-2 text-sm text-graphite">
        {features.map((feature) => (
          <li key={feature}>- {feature}</li>
        ))}
      </ul>
      <Button variant={highlight ? "primary" : "secondary"}>Pilih Paket</Button>
    </div>
  );
}
