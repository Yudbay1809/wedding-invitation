export function SearchBar({
  placeholder = "Search...",
  name = "q",
  defaultValue = "",
  action = ""
}: {
  placeholder?: string;
  name?: string;
  defaultValue?: string;
  action?: string;
}) {
  return (
    <form action={action} className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-soft border border-black/5">
      <span className="text-xs text-graphite">Search</span>
      <input
        className="w-full bg-transparent text-sm outline-none"
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
      />
    </form>
  );
}
