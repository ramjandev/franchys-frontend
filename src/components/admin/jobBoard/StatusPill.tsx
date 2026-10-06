import { ChevronDown } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { STATUS_MAP, STATUS_OPTIONS } from "./Data";
import useDropdown from "./useDropdown";

interface StatusPillProps {
  statusKey: string;
  onChange: (key: string) => void;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
}

const StatusPill: React.FC<StatusPillProps> = ({ statusKey, onChange }) => {
  const normalizedKey = statusKey ? statusKey.toUpperCase().replace(/\s+/g, "_") : "QUOTE";
  const s = STATUS_MAP[statusKey] ?? STATUS_MAP[normalizedKey] ?? STATUS_MAP[statusKey?.toLowerCase()] ?? STATUS_MAP["QUOTE"] ?? STATUS_OPTIONS[0];
  const { open, setOpen, ref } = useDropdown();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  // Recalculate the menu's fixed-position coordinates from the trigger's
  // actual screen position whenever it opens, so it's never clipped by an
  // ancestor's overflow-hidden (e.g. the rounded table wrapper) and always
  // lands directly under (or, if there's no room, above) the trigger.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 0;
      const gap = 4;

      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const shouldFlipUp =
        spaceBelow < menuHeight + gap && triggerRect.top > menuHeight + gap;

      setMenuPosition({
        top: shouldFlipUp
          ? triggerRect.top - menuHeight - gap
          : triggerRect.bottom + gap,
        left: triggerRect.left,
        width: Math.max(triggerRect.width, 160),
      });
    };

    // measure once now, then again after the menu has actually rendered
    // so `menuHeight` above is accurate rather than 0 on the first pass
    updatePosition();
    const raf = requestAnimationFrame(updatePosition);

    const closeOnScroll = () => setOpen(false);
    window.addEventListener("scroll", closeOnScroll, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", closeOnScroll, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, setOpen]);

  return (
    <div ref={ref} className="relative max-w-44">
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-between whitespace-nowrap  gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer border-[1.13px] ${s.bg} ${s.text} ${s.border}  w-full`}
      >
        <span>
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: s.color }}
          />
          {s.label}
        </span>
        <ChevronDown className="w-3 h-3 " />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            // Prevent this mousedown from bubbling to document, which is
            // how useDropdown's outside-click detection likely works — the
            // menu now lives outside `ref`'s DOM subtree (it's portaled),
            // so without this it would register as an "outside" click and
            // close itself immediately on every click.
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: menuPosition?.top ?? -9999,
              left: menuPosition?.left ?? -9999,
              width: menuPosition?.width,
              visibility: menuPosition ? "visible" : "hidden",
            }}
            className="bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50 min-w-[160px] overflow-hidden"
          >
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  onChange(opt.key);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: opt.color }}
                />
                <span className={opt.text} style={{ fontWeight: 500 }}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default StatusPill;
