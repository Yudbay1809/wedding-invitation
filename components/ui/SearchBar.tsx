export function SearchBar({ placeholder = "Search..." }: { placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-soft border border-black/5">
      <span className="text-xs text-graphite">Search</span>
      <input
        className="w-full bg-transparent text-sm outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}
