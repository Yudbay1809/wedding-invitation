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
        <label key={theme.id} className="surface p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">{theme.name}</span>
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
