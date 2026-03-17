import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="surface p-6 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-graphite mt-2">{description}</p>
      {actionLabel && actionHref ? (
        <div className="mt-4 flex justify-center">
          <Link href={actionHref}>
            <Button>{actionLabel}</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
