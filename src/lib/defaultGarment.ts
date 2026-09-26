/**
 * Default clean Garment Mockup SVG Template.
 * Used when a catalog product doesn't have custom photographs uploaded yet,
 * allowing users to immediately place logos, text, and artwork on the canvas
 * without being blocked or asked to re-select a product.
 */
export const DEFAULT_GARMENT_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="600" height="700">
  <defs>
    <radialGradient id="garmentShade" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </radialGradient>
    <filter id="garmentShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.1"/>
    </filter>
  </defs>
  <!-- Garment Body -->
  <path d="M 215 45 Q 300 100 385 45 L 530 135 L 470 235 L 405 195 L 405 645 Q 300 655 195 645 L 195 195 L 130 235 L 70 135 Z" 
        fill="url(#garmentShade)" stroke="#cbd5e1" stroke-width="2.5" stroke-linejoin="round" filter="url(#garmentShadow)"/>
  <!-- Collar -->
  <path d="M 215 45 Q 300 100 385 45 Q 300 75 215 45 Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
  <!-- Left Sleeve Seam -->
  <path d="M 195 195 L 130 235" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3 3"/>
  <!-- Right Sleeve Seam -->
  <path d="M 405 195 L 470 235" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3 3"/>
  <!-- Bottom Hem -->
  <path d="M 195 645 Q 300 655 405 645" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4 4"/>
</svg>
`)}`;

/**
 * Robustly extracts all image URLs from a product entity or autocomplete item.
 * Supports string arrays, JSON strings, single image fields, primaryImageUrl, and color variants.
 */
export function extractProductImages(prod: any): string[] {
  if (!prod) return [];
  const found: string[] = [];

  const add = (val: any) => {
    if (!val) return;
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (!trimmed) return;
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            parsed.forEach(add);
            return;
          }
        } catch {}
      }
      if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("data:") ||
        trimmed.startsWith("/")
      ) {
        found.push(trimmed);
      }
    } else if (Array.isArray(val)) {
      val.forEach(add);
    } else if (typeof val === "object") {
      if (val.url) add(val.url);
      if (val.imageUrl) add(val.imageUrl);
      if (val.image) add(val.image);
    }
  };

  add(prod.images);
  add(prod.primaryImageUrl);
  add(prod.image);
  add(prod.imageUrl);
  add(prod.thumbnail);
  add(prod.colorSquareUrl);
  if (prod.colors && Array.isArray(prod.colors)) {
    prod.colors.forEach((c: any) => {
      add(c.image);
      add(c.imageUrl);
      add(c.images);
    });
  }

  return Array.from(new Set(found.filter(Boolean)));
}
