export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="surface p-6 animate-pulse text-graphite">
      {label}
    </div>
  );
}
