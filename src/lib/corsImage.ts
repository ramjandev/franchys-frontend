import { MockupLayer } from "@/store/mockUp/designSlice";

/**
 * Returns a CORS-safe URL for external images that lack Access-Control-Allow-Origin headers.
 * Uses wsrv.nl as an image proxy when needed to allow canvas export without SecurityError.
 */
export function getCorsSafeUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();

  // Data URLs and Blob URLs are already local and CORS-safe
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // Localhost or relative paths are safe
  if (
    trimmed.startsWith("/") ||
    trimmed.includes("localhost") ||
    trimmed.includes("127.0.0.1")
  ) {
    return trimmed;
  }

  // Backend origin (franchys.dynv6.net) already sends Access-Control-Allow-Origin: *
  if (trimmed.includes("franchys.dynv6.net")) {
    return trimmed;
  }

  // If it's an external URL (e.g. SanMar CDN or any 3rd party domain), route through wsrv.nl
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return `https://wsrv.nl/?url=${encodeURIComponent(trimmed)}&output=png`;
  }

  return trimmed;
}

/**
 * Pure canvas composite rendering: draws product image & design layers onto an offscreen canvas
 * and safely exports to a PNG Blob without DOM dependencies or canvas taint errors.
 */
export async function renderMockupToBlob({
  productImageUrl,
  layers,
  width = 600,
  height = 600,
  format = "image/jpeg",
  quality = 0.85,
}: {
  productImageUrl?: string | null;
  layers: MockupLayer[];
  width?: number;
  height?: number;
  format?: "image/jpeg" | "image/png";
  quality?: number;
}): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 1. Draw clean white background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  // 2. Draw base product image (if provided)
  if (productImageUrl) {
    try {
      const safeUrl = getCorsSafeUrl(productImageUrl);
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => {
          // Fallback: try raw URL if proxy had an issue
          if (safeUrl !== productImageUrl) {
            const rawImg = new Image();
            rawImg.crossOrigin = "anonymous";
            rawImg.onload = () => {
              img.src = rawImg.src;
              resolve();
            };
            rawImg.onerror = () => resolve();
            rawImg.src = productImageUrl;
          } else {
            resolve();
          }
        };
        img.src = safeUrl;
      });

      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = width / height;
        let drawW = width;
        let drawH = height;
        let drawX = 0;
        let drawY = 0;

        if (imgAspect > canvasAspect) {
          drawH = width / imgAspect;
          drawY = (height - drawH) / 2;
        } else {
          drawW = height * imgAspect;
          drawX = (width - drawW) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
    } catch (e) {
      console.warn("Could not draw product background to canvas:", e);
    }
  }

  // 3. Draw layers on top in order
  for (const layer of layers) {
    if (!layer.visible) continue;

    ctx.save();
    ctx.translate(layer.x + layer.w / 2, layer.y + layer.h / 2);
    ctx.rotate(((layer.rotation || 0) * Math.PI) / 180);
    ctx.scale(layer.scale || 1, layer.scale || 1);
    ctx.translate(-(layer.w / 2), -(layer.h / 2));

    if (layer.type === "image" && layer.src) {
      try {
        const lImg = new Image();
        if (!layer.src.startsWith("data:")) {
          lImg.crossOrigin = "anonymous";
        }
        const safeLayerSrc = getCorsSafeUrl(layer.src);

        await new Promise<void>((resolve) => {
          lImg.onload = () => resolve();
          lImg.onerror = () => resolve();
          lImg.src = safeLayerSrc;
        });

        if (lImg.naturalWidth > 0) {
          ctx.drawImage(lImg, 0, 0, layer.w, layer.h);
        }
      } catch (err) {
        console.warn("Could not draw layer image:", err);
      }
    } else if (layer.type === "text" && layer.text) {
      ctx.fillStyle = layer.color || "#000000";
      ctx.font = `bold ${layer.fontSize || 18}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(layer.text, layer.w / 2, layer.h / 2);
    } else if (layer.type === "shape") {
      ctx.fillStyle = layer.color || "#4A90E2";
      if (layer.shapeType === "circle") {
        ctx.beginPath();
        ctx.arc(
          layer.w / 2,
          layer.h / 2,
          Math.min(layer.w, layer.h) / 2,
          0,
          2 * Math.PI,
        );
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, layer.w, layer.h);
      }
    } else if (layer.type === "path" && layer.points && layer.points.length > 1) {
      ctx.strokeStyle = layer.color || "#EF4444";
      ctx.lineWidth = layer.strokeWidth || 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(layer.points[0].x, layer.points[0].y);
      for (let i = 1; i < layer.points.length; i++) {
        ctx.lineTo(layer.points[i].x, layer.points[i].y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  // 4. Export safely to Blob with compression
  return new Promise<Blob | null>((resolve) => {
    try {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            try {
              const dataUrl = canvas.toDataURL(format, quality);
              fetch(dataUrl)
                .then((r) => r.blob())
                .then(resolve)
                .catch(() => resolve(null));
            } catch {
              resolve(null);
            }
          }
        },
        format,
        quality,
      );
    } catch (e) {
      console.error("Canvas export failed:", e);
      resolve(null);
    }
  });
}
