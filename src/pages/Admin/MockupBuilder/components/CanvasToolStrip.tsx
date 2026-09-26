import React from "react";

interface CanvasToolStripProps {
  activeTool: string;
  onActionClick: (toolId: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  jsonInputRef: React.RefObject<HTMLInputElement | null>;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleJSONImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CanvasToolStrip: React.FC<CanvasToolStripProps> = ({
  activeTool,
  onActionClick,
  fileInputRef,
  jsonInputRef,
  handleLogoUpload,
  handleJSONImport,
}) => {
  const tools = [
    {
      id: "add-product",
      label: "Add Product Image",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    },
    {
      id: "erase",
      label: "Erase Sample Logo",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 20H7L3 16l10-10 7 7-2.5 2.5" />
          <path d="M6 11l7 7" />
        </svg>
      )
    },
    {
      id: "add-logo",
      label: "Add Logo",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      )
    },
    {
      id: "add-text",
      label: "Add Text",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="12" y1="7" x2="12" y2="21" />
          <line x1="9" y1="21" x2="15" y2="21" />
        </svg>
      )
    },
    {
      id: "add-shape",
      label: "Add Shape",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 4 7 12 17 12" />
          <rect x="5" y="14" width="6" height="6" rx="1" />
          <circle cx="17" cy="17" r="3" />
        </svg>
      )
    },
    {
      id: "pencil",
      label: "Pencil",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      )
    },
    {
      id: "brush",
      label: "Brush",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
          <path d="M7.07 14.94C5.79 16.22 5 17.5 4 19.38c-.5.84-.16 1.93.77 2.29 1.45.57 3.55-.2 4.77-2.53.37-.72.64-1.47.83-2.23L7.07 14.94z" />
        </svg>
      )
    },
    {
      id: "fill",
      label: "Fill",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M5 15a7 7 0 0 0 14 0" />
          <path d="M19 11a7 7 0 0 1-7 7 7 7 0 0 1-7-7c0-4 7-12 7-12s7 8 7 12z" />
          <path d="M21 19.5a1.5 1.5 0 1 1-3 0c0-1.5 1.5-2.5 1.5-2.5s1.5 1 1.5 2.5z" />
        </svg>
      )
    },
    {
      id: "curve",
      label: "Curve",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19 C8 12, 12 8, 19 5" />
          <circle cx="5" cy="19" r="1.5" fill="white" />
          <circle cx="19" cy="5" r="1.5" fill="white" />
        </svg>
      )
    },
    {
      id: "open-project",
      label: "Open Project",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="md:w-[96px] px-4 md:px-0 w-full shrink-0 bg-white border border-[#E6EBF2] rounded-xl flex flex-row md:flex-col items-center py-4 gap-2 shadow-sm overflow-y-auto">
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        return (
          <button
            type="button"
            key={tool.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onActionClick(tool.id);
            }}
            className={`w-[60px] md:w-[80px] h-[60px] md:h-[80px] rounded-xl px-4 py-2 xl:py-0 xl:px-0 flex flex-col items-center justify-center gap-1 transition-all border shadow-sm ${isActive
              ? "bg-[#007FFF] text-white border-[#007FFF]"
              : "bg-white text-[#6B7280] border-[#E6EBF2] hover:bg-gray-50"
              }`}
          >
            {tool.icon}
            <span className="text-[8px] font-bold text-center tracking-tight leading-tight px-1 max-h-[22px] overflow-hidden">
              {tool.label}
            </span>
          </button>
        );
      })}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleLogoUpload}
      />
      <input
        ref={jsonInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleJSONImport}
      />
    </div>
  );
};

export default CanvasToolStrip;
