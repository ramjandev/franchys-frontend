import { useState } from "react";
import { ArrowLeft, Type, ZoomIn, ZoomOut, Save } from "lucide-react";
import { Link } from "react-router-dom";

const garmentOptions = [
  { code: "3001", name: "Bella+Canvas CVC Unisex T-Shirt" },
  { code: "5000", name: "Gildan Heavy Cotton T-Shirt" },
  { code: "8000", name: "Gildan DryBlend 50/50 T-Shirt" },
  { code: "18500", name: "Gildan Heavy Blend Hoodie" },
];

const sidebarTools = [
  {
    id: "add-product",
    label: "Add Product Image",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: "erase",
    label: "Erase Sample Logo",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 20H7L3 16l10-10 7 7-2.5 2.5" />
        <path d="M6.0 11.0 L13.0 18.0" />
      </svg>
    ),
    active: true,
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
    ),
  },
  {
    id: "add-text",
    label: "Add Text",
    icon: <Type size={22} />,
  },
  {
    id: "add-shape",
    label: "Add Shape",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="8" height="8" />
        <rect x="13" y="3" width="8" height="8" />
        <rect x="3" y="13" width="8" height="8" />
        <rect x="13" y="13" width="8" height="8" />
      </svg>
    ),
  },
  {
    id: "pencil",
    label: "Pencil",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    ),
  },
  {
    id: "brush",
    label: "Brush",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
        <path d="M7.07 14.94C5.79 16.22 5 17.5 4 19.38c-.5.84-.16 1.93.77 2.29 1.45.57 3.55-.2 4.77-2.53.37-.72.64-1.47.83-2.23L7.07 14.94z" />
      </svg>
    ),
  },
  {
    id: "fill",
    label: "Fill",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M19 11a7 7 0 0 1-7 7 7 7 0 0 1-7-7c0-4 7-12 7-12s7 8 7 12z" />
      </svg>
    ),
  },
  {
    id: "curve",
    label: "Curve",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 17C6 17 9 3 12 3s6 14 9 14" />
      </svg>
    ),
  },
  {
    id: "open-project",
    label: "Open Project",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const Mockups = () => {
  const [activeTool, setActiveTool] = useState("erase");
  const [activeView, setActiveView] = useState("Front");
  const [clothingCode, setClothingCode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("T-Shirt — White");
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState<"Top" | "Center" | "Left" | "Right">("Center");
  const [hasGarment, setHasGarment] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-0 -m-6 bg-[#F1F5F9]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#E6EBF2] shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard">
            <ArrowLeft className="w-5 h-5 text-[#5C7899] hover:text-[#111827]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#111827] leading-tight">Mockup Design</h1>
            <p className="text-xs text-[#5C7899]">Create product mockups with your custom designs</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search jobs..."
            className="h-9 w-52 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF] bg-[#F8FAFC]"
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Tools Panel */}
        <div className="w-[300px] shrink-0 bg-white border-r border-[#E6EBF2] overflow-y-auto p-5 space-y-5">
          <h3 className="font-bold text-[#111827]">Tools</h3>

          {/* Clothing Code */}
          <div>
            <p className="text-sm font-semibold text-[#111827] mb-1">Clothing Code</p>
            <p className="text-xs text-[#A0B0C0] mb-2">Enter a product code (e.g. 8000) to load a blank garment</p>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-[#E6EBF2] rounded-lg h-10 px-3 bg-[#F8FAFC]">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#A0B0C0" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  value={clothingCode}
                  onChange={(e) => setClothingCode(e.target.value)}
                  placeholder="e.g. 8000"
                  className="flex-1 text-sm outline-none bg-transparent text-[#111827]"
                />
              </div>
              <button
                onClick={() => setHasGarment(true)}
                className="px-3 h-10 bg-[#0077FF] hover:bg-[#0060CE] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Upload Logo */}
          <div>
            <p className="text-sm font-semibold text-[#111827] mb-2">Upload Logo</p>
            <button className="w-full flex items-center gap-2 justify-center h-9 border border-[#E6EBF2] rounded-lg text-sm text-[#5C7899] hover:bg-[#F8FAFC] transition-colors">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Choose File
            </button>
            <button className="mt-2 w-full text-sm text-[#D97706] font-semibold flex items-center gap-1.5 justify-center hover:opacity-80 transition-opacity">
              <span>✨</span> Remove Background
            </button>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-semibold text-[#111827] mb-2">Product</p>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm text-[#111827] outline-none focus:border-[#0077FF] bg-white"
            >
              <option>T-Shirt — White</option>
              <option>T-Shirt — Black</option>
              <option>Hoodie — White</option>
              <option>Polo — Navy</option>
            </select>
          </div>

          {/* Scale */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-[#111827]">Scale</p>
              <span className="text-sm text-[#5C7899]">{scale}%</span>
            </div>
            <input
              type="range" min="10" max="200" value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-[#0077FF]"
            />
          </div>

          {/* Rotation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-[#111827]">Rotation</p>
              <span className="text-sm text-[#5C7899]">{rotation}°</span>
            </div>
            <input
              type="range" min="-180" max="180" value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full accent-[#0077FF]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 h-9 border border-[#E6EBF2] rounded-lg text-sm text-[#5C7899] hover:bg-[#F8FAFC] transition-colors">
              <svg viewBox="0 0 24 24" width="14" height="14" className="inline mr-1" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </button>
            <button
              onClick={() => { setScale(100); setRotation(0); }}
              className="flex-1 h-9 border border-[#E6EBF2] rounded-lg text-sm text-[#5C7899] hover:bg-[#F8FAFC] transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Center Toolbar (icon strip) */}
        <div className="w-14 shrink-0 bg-white border-r border-[#E6EBF2] flex flex-col items-center py-3 gap-1 overflow-y-auto">
          {sidebarTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center transition-colors ${
                activeTool === tool.id
                  ? "bg-[#0077FF] text-white"
                  : "text-[#5C7899] hover:bg-[#F1F5F9] hover:text-[#111827]"
              }`}
            >
              {tool.icon}
              <span className="text-[9px] mt-0.5 leading-tight text-center max-w-[44px] truncate">
                {tool.label.split(" ").slice(0, 2).join(" ")}
              </span>
            </button>
          ))}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* View Tabs */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#E6EBF2]">
            <div className="flex gap-1">
              {["Front", "Back", "Left Sleeve", "Right Sleeve"].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeView === view
                      ? "bg-[#0077FF] text-white"
                      : "text-[#5C7899] hover:bg-[#F1F5F9]"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[#5C7899]">
              <button className="p-1 hover:text-[#111827]"><ZoomOut size={16} /></button>
              <span className="text-sm font-medium">100%</span>
              <button className="p-1 hover:text-[#111827]"><ZoomIn size={16} /></button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-hidden flex items-center justify-center bg-[#F1F5F9] relative">
            {!hasGarment ? (
              <div className="flex flex-col items-center gap-6">
                {/* Empty state shirt icon */}
                <div className="text-[#CBD5E1]">
                  <svg viewBox="0 0 80 80" width="80" height="80" fill="currentColor">
                    <path d="M25 5 L10 20 L20 25 L20 70 L60 70 L60 25 L70 20 L55 5 C55 5 50 15 40 15 C30 15 25 5 25 5Z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[#5C7899] font-semibold text-base">No garment selected</p>
                  <p className="text-[#A0B0C0] text-sm mt-1">
                    Enter a clothing code (e.g. <span className="font-bold text-[#0077FF]">8000</span>) in the Tools panel to load a blank garment, then upload your logo.
                  </p>
                </div>

                {/* Quick product list */}
                <div className="flex flex-col gap-2 w-72">
                  {garmentOptions.map((g) => (
                    <button
                      key={g.code}
                      onClick={() => { setClothingCode(g.code); setHasGarment(true); }}
                      className="flex items-center gap-3 bg-white rounded-lg px-4 py-2.5 text-sm text-left hover:border-[#0077FF] hover:shadow-sm border border-[#E6EBF2] transition-all"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0077FF" strokeWidth="2">
                        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
                      </svg>
                      <span className="font-bold text-[#0077FF] mr-1">{g.code}</span>
                      <span className="text-[#5C7899] text-xs">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Show a garment mockup preview
              <div className="relative w-80 h-96">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[#CBD5E1] opacity-30">
                    <svg viewBox="0 0 200 240" width="280" height="340" fill="#94a3b8">
                      <path d="M60 10 L20 50 L50 65 L50 220 L150 220 L150 65 L180 50 L140 10 C140 10 125 35 100 35 C75 35 60 10 60 10Z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-24 border-2 border-dashed border-[#0077FF]/30 rounded-lg flex items-center justify-center text-[#0077FF]/40 text-xs font-medium text-center p-2">
                      Drop logo here or use Upload Logo
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar — Layers, Position, Export */}
        <div className="w-[220px] shrink-0 bg-white border-l border-[#E6EBF2] flex flex-col overflow-y-auto">
          {/* Layers */}
          <div className="p-4 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#111827] mb-3">Layers</h3>
            <div className="bg-[#F8FAFC] rounded-lg px-3 py-2 text-sm text-[#5C7899] font-medium">
              Product Base
            </div>
          </div>

          {/* Position */}
          <div className="p-4 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#111827] mb-3">Position</h3>
            <div className="grid grid-cols-2 gap-2">
              {(["Top", "Center", "Left", "Right"] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={`h-8 rounded-lg text-xs font-semibold transition-colors ${
                    position === pos
                      ? "bg-[#0077FF] text-white"
                      : "bg-[#F1F5F9] text-[#5C7899] hover:bg-[#E2E8F0]"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className="p-4 flex-1">
            <h3 className="text-sm font-bold text-[#111827] mb-3">Export</h3>
            <div className="space-y-2">
              {["Export as PNG", "Export as JPG", "Export as SVG"].map((opt) => (
                <button
                  key={opt}
                  className="w-full flex items-center gap-2 h-9 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-lg px-3 text-xs text-[#5C7899] font-medium transition-colors border border-[#E6EBF2]"
                >
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {opt}
                </button>
              ))}
            </div>
            <button className="w-full mt-4 h-10 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
              <Save size={15} />
              Save Mockup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mockups;
