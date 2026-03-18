const themes = [
  { id: "classic", name: "Classic Elegant" },
  { id: "minimal", name: "Minimal Modern" },
  { id: "romantic", name: "Romantic Floral" },
  { id: "luxury", name: "Luxury Gold" },
  { id: "boho", name: "Boho Sunset" },
  { id: "garden", name: "Garden Vows" },
  { id: "modern", name: "Modern Noir" },
  { id: "celestial", name: "Celestial Night" }
];

export function ThemeSelector({
  value,
  disabledIds = [],
  name = "theme"
}: {
  value?: string;
  disabledIds?: string[];
  name?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((theme) => (
        <label
          key={theme.id}
          className={`surface p-4 flex items-center justify-between ${
            disabledIds.includes(theme.id) ? "opacity-50" : ""
          }`}
        >
          <div className="grid gap-1">
            <span className="text-sm font-semibold text-ink">{theme.name}</span>
            {disabledIds.includes(theme.id) ? (
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-graphite">Locked</span>
            ) : null}
          </div>
          <input
            type="radio"
            name={name}
            value={theme.id}
            defaultChecked={value === theme.id}
            disabled={disabledIds.includes(theme.id)}
          />
        </label>
      ))}
    </div>
  );
}
