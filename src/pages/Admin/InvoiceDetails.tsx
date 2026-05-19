import { useState } from "react";

const shirtColors = [
  "#1a2744",
  "#c0392b",
  "#e8c840",
  "#7a3b2e",
  "#2c2c2c",
  "#f5f5f5",
];

const items = [
  { id: 1, description: "Polo Shirt - Navy", size: "M", quantity: 50 },
  { id: 2, description: "Polo Shirt - Navy", size: "L", quantity: 60 },
  { id: 3, description: "Polo Shirt - Navy", size: "XL", quantity: 40 },
  { id: 4, description: "Embroidery Setup", size: "—", quantity: 1 },
  { id: 5, description: "Left Chest Logo", size: "—", quantity: 150 },
];

const qcItems = [
  "All items produced according to specifications",
  "Artwork placement and alignment verified",
  "Color matching approved",
  "Size breakdown confirmed",
  "Final inspection completed",
];

export default function InvoiceDetails() {
  const [doneCells, setDoneCells] = useState<Record<number, boolean>>({});
  const [qcChecked, setQcChecked] = useState<Record<number, boolean>>({});

  const toggleDone = (id: number) =>
    setDoneCells((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleQc = (i: number) =>
    setQcChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div
      className="min-h-screen bg-[#f4f3ef] font-sans"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* Decorative top stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#e07b39] via-[#c0392b] to-[#1a2744]" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block bg-[#e07b39] text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full mb-3">
              Production Sheet
            </span>
            <h1
              className="text-4xl font-black text-[#1a2033] tracking-tight leading-none"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Job #Q-1001
            </h1>
            <p className="text-xs text-[#8a8a8a] mt-1.5 tracking-wide uppercase font-medium">
              For Production Team Only · No Pricing Info
            </p>
          </div>
          <button className="mt-1 border-2 border-[#e07b39] text-[#e07b39] text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#e07b39] hover:text-white transition-all duration-200 tracking-wide">
            Art
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Customer",
              value: "Company Status Workflow",
              accent: false,
            },
            { label: "Order Date", value: "Dec 18, 2025", accent: false },
            { label: "Due Date", value: "Jan 15, 2026", accent: "red" },
            { label: "Total Units", value: "150", accent: "green" },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              className={`rounded-2xl border px-4 py-3 ${
                accent === "red"
                  ? "border-red-200 bg-red-50"
                  : accent === "green"
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-[#e8e6df] bg-white"
              }`}
            >
              <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-[#aaa] mb-1">
                {label}
              </p>
              <p
                className={`text-sm font-bold leading-tight ${
                  accent === "red"
                    ? "text-red-600"
                    : accent === "green"
                      ? "text-emerald-700"
                      : "text-[#1a2033]"
                }`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Artwork / Mockup */}
        <section>
          <SectionLabel>Artwork / Mockup</SectionLabel>
          <div className="mt-3 rounded-2xl border border-[#e8e6df] bg-white overflow-hidden">
            <div className="flex items-center justify-center gap-3 p-8">
              {shirtColors.map((color, i) => (
                <div
                  key={i}
                  className="relative"
                  style={{
                    transform: `rotate(${(i - 2.5) * 3}deg) translateY(${Math.abs(i - 2.5) * 2}px)`,
                  }}
                >
                  <ShirtIcon color={color} />
                </div>
              ))}
            </div>
            <div className="border-t border-[#f0ede6] bg-[#fafaf8] px-6 py-3">
              <p className="text-[11px] text-[#aaa] font-medium text-center tracking-wide">
                Artwork / Mockup Preview — Navy Polo Collection
              </p>
            </div>
          </div>
        </section>

        {/* Decoration Method */}
        <section>
          <SectionLabel>Decoration Method & Specifications</SectionLabel>
          <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#e07b39]/10 border border-orange-200 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-[#e07b39]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1a2033]">
                Embroidery – Left Chest
              </p>
              <p className="text-[12px] text-[#7a6a5a] mt-0.5 leading-relaxed">
                Embroidery thread: Navy #3842. Position: 4″ from shoulder seam,
                centered.
              </p>
            </div>
          </div>
        </section>

        {/* Items Table */}
        <section>
          <SectionLabel>Items to Produce</SectionLabel>
          <div className="mt-3 rounded-2xl overflow-hidden border border-[#e8e6df]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a2033]">
                  {["Item Description", "Size", "Quantity", "Done"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-bold tracking-[0.12em] uppercase text-[#8a9bb5]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`border-t border-[#f0ede6] transition-colors ${
                      doneCells[item.id]
                        ? "bg-emerald-50"
                        : idx % 2 === 0
                          ? "bg-white"
                          : "bg-[#fafaf8]"
                    }`}
                  >
                    <td className="px-5 py-3.5 text-[#2c2c2c] font-medium text-[13px]">
                      {item.description}
                    </td>
                    <td className="px-5 py-3.5 text-[#9a9a9a] text-[13px]">
                      {item.size}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#1a2033]">
                      {item.quantity}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleDone(item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
                          doneCells[item.id]
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-[#ccc] hover:border-[#e07b39]"
                        }`}
                      >
                        {doneCells[item.id] && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Production Notes */}
        <section>
          <SectionLabel>Additional Production Notes</SectionLabel>
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-[13px] text-[#7a6030] leading-relaxed">
              Customer wants navy blue polos with company logo on left chest.
              Logo artwork approved.
            </p>
          </div>
        </section>

        {/* QC Checklist */}
        <section>
          <SectionLabel>Quality Control Checklist</SectionLabel>
          <div className="mt-3 space-y-2">
            {qcItems.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleQc(i)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl border text-left transition-all duration-150 ${
                  qcChecked[i]
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-[#e8e6df] bg-white hover:border-[#e07b39]/40"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
                    qcChecked[i]
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-[#ccc]"
                  }`}
                >
                  {qcChecked[i] && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-[13px] font-medium transition-colors ${
                    qcChecked[i]
                      ? "text-emerald-700 line-through"
                      : "text-[#2c2c2c]"
                  }`}
                >
                  {item}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="pt-2 pb-8 text-center">
          <p className="text-[10px] text-[#bbb] tracking-widest uppercase">
            Confidential · Production Team Use Only
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-5 rounded-full bg-[#e07b39]" />
      <h2
        className="text-base font-bold text-[#1a2033]"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        {children}
      </h2>
    </div>
  );
}

function ShirtIcon({ color }: { color: string }) {
  return (
    <svg
      width="44"
      height="52"
      viewBox="0 0 44 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))" }}
    >
      <path
        d="M14 2L2 10L8 16L10 14V48H34V14L36 16L42 10L30 2C30 2 28 6 22 6C16 6 14 2 14 2Z"
        fill={color}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
    </svg>
  );
}
