// Curated list of common color names mapped to hex codes.
// Used to auto-suggest a name when the user picks a color.
export const NAMED_COLORS: { name: string; code: string }[] = [
  { name: "Midnight Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Arctic White", code: "#F8FAFC" },
  { name: "Charcoal Gray", code: "#374151" },
  { name: "Slate Gray", code: "#64748B" },
  { name: "Navy Blue", code: "#1E3A8A" },
  { name: "Royal Blue", code: "#1D4ED8" },
  { name: "Sky Blue", code: "#0EA5E9" },
  { name: "Crimson Red", code: "#DC2626" },
  { name: "Maroon", code: "#7F1D1D" },
  { name: "Forest Green", code: "#15803D" },
  { name: "Olive Green", code: "#4D7C0F" },
  { name: "Mustard Yellow", code: "#CA8A04" },
  { name: "Amber", code: "#F59E0B" },
  { name: "Burnt Orange", code: "#C2410C" },
  { name: "Coral", code: "#F97316" },
  { name: "Blush Pink", code: "#EC4899" },
  { name: "Lavender", code: "#A78BFA" },
  { name: "Royal Purple", code: "#7C3AED" },
  { name: "Chocolate Brown", code: "#92400E" },
  { name: "Tan", code: "#D2B48C" },
  { name: "Beige", code: "#F5F0E6" },
  { name: "Teal", code: "#0D9488" },
  { name: "Turquoise", code: "#06B6D4" },
];

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized,
    16,
  );
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

// Finds the closest named color to a given hex code by Euclidean RGB distance.
export const findNearestColorName = (hex: string): string => {
  try {
    const target = hexToRgb(hex);
    let closest = NAMED_COLORS[0];
    let closestDistance = Infinity;

    for (const color of NAMED_COLORS) {
      const c = hexToRgb(color.code);
      const distance =
        (c.r - target.r) ** 2 + (c.g - target.g) ** 2 + (c.b - target.b) ** 2;
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = color;
      }
    }
    return closest.name;
  } catch {
    return "Custom Color";
  }
};
