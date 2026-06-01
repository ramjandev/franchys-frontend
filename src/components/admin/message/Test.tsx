import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "Email" | "WhatsApp";
type View = "messages" | "campaigns" | "campaignDetail" | "newCampaign";
type CampaignType = "Newsletter" | "Promotion" | "Discount";

interface Message {
  id: number;
  subject: string;
  from: string;
  preview: string;
  date: string;
  unread?: number;
}

interface Campaign {
  id: number;
  title: string;
  type: CampaignType;
  subject: string;
  content: string;
  status: "sent" | "draft";
  products: Product[];
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  emoji: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MESSAGES: Message[] = [
  {
    id: 1,
    subject:
      "Quote #1008: Artwork and Department of Elementary & Secondary Education",
    from: "Maria Laura Marte",
    preview:
      "Hi Rebecca, I wanted to follow up on the artwork approval for your recent order. We've prepared the mockups based on your specifications...",
    date: "Oct 23, 11:46am",
    unread: 2,
  },
  {
    id: 2,
    subject: "Quote sent: Production Reminder",
    from: "System",
    preview:
      "This is an automated reminder that your quote #1008 has been sent to the customer. Please follow up if you haven't received a response.",
    date: "Oct 22, 3:15pm",
  },
  {
    id: 3,
    subject: "Quote Updated",
    from: "Rebecca DeCesaris",
    preview:
      "I reviewed the quote and would like to make a few changes to the quantities. Can we adjust the order from 40 to 50 units?",
    date: "Oct 21, 9:38am",
    unread: 1,
  },
  {
    id: 4,
    subject: "Re: Invoice #1006",
    from: "Mike's Cool Shirts",
    preview:
      "Payment has been processed for invoice #1006. The total amount of $1,489.00 has been received. Thank you for your business.",
    date: "Oct 20, 2:22pm",
  },
  {
    id: 5,
    subject: "Request for Quote",
    from: "Sunrise Co.",
    preview:
      "We are interested in getting a quote for custom embroidered patches for our team uniforms...",
    date: "Oct 19, 9:00am",
  },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Custom Embroidered Patches",
    category: "Patches",
    price: "$45.00",
    emoji: "🟧",
  },
  {
    id: 2,
    name: "Logo Design Service",
    category: "Services",
    price: "$120.00",
    emoji: "🎨",
  },
  {
    id: 3,
    name: "Custom T-Shirt Printing",
    category: "Apparel",
    price: "$25.00",
    emoji: "👕",
  },
  {
    id: 4,
    name: "Business Cards (500 pack)",
    category: "Print",
    price: "$89.00",
    emoji: "🪪",
  },
  {
    id: 5,
    name: "Promotional Stickers",
    category: "Stickers",
    price: "$35.00",
    emoji: "⭐",
  },
  {
    id: 6,
    name: "Banner Printing",
    category: "Print",
    price: "$150.00",
    emoji: "🖼️",
  },
];

const SENT_CAMPAIGN: Campaign = {
  id: 1,
  title: "Spring Sale - 20% Off Custom Patches",
  type: "Promotion",
  subject: "Don't miss out - Spring Sale - 20% Off Custom Patches",
  content:
    "Dear valued customer,\n\nWe're excited to share this exclusive offer with you! Spring Sale - 20% Off Custom Patches.\n\nCheck out our featured products below and take advantage of this limited-time offer.\n\nBest regards,\nThe Team",
  status: "sent",
  products: [PRODUCTS[0], PRODUCTS[1]],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ count }: { count: number }) {
  return (
    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[11px] font-semibold text-white">
      {count}
    </span>
  );
}

function MessageList({
  messages,
  selected,
  onSelect,
}: {
  messages: Message[];
  selected: Message | null;
  onSelect: (m: Message) => void;
}) {
  return (
    <div className="flex flex-col divide-y divide-slate-100 overflow-y-auto">
      {messages.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
          className={`w-full px-4 py-4 text-left transition-colors hover:bg-slate-50 ${
            selected?.id === m.id
              ? "border-l-4 border-blue-500 bg-blue-50/60"
              : "border-l-4 border-transparent"
          }`}
        >
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm ${
                  m.unread
                    ? "font-semibold text-slate-800"
                    : "font-medium text-slate-700"
                }`}
              >
                {m.subject}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">By: {m.from}</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                {m.preview}
              </p>
              <p className="mt-1.5 text-[11px] text-slate-400">{m.date}</p>
            </div>
            {m.unread && <Badge count={m.unread} />}
          </div>
        </button>
      ))}
      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 py-4">
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            className={`h-7 w-7 rounded text-sm font-medium transition-colors ${
              p === 1
                ? "bg-blue-500 text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {p}
          </button>
        ))}
        <span className="text-slate-400">...</span>
        <button className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">
          Last
        </button>
      </div>
    </div>
  );
}

function MessageDetail({ message }: { message: Message }) {
  const [reply, setReply] = useState("");
  return (
    <div className="flex h-full flex-col p-8">
      <h2 className="text-xl font-semibold text-slate-800">
        {message.subject}
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        From: {message.from} &bull; {message.date}
      </p>
      <div className="mt-6 flex-1 space-y-3 text-sm leading-relaxed text-slate-700">
        <p>{message.preview}</p>
        <p>
          Please let me know if you have any questions or need any clarification
          on the details. We're committed to delivering exactly what you need
          for this project.
        </p>
        <p>Looking forward to your response.</p>
        <p className="mt-4">
          Best regards,
          <br />
          {message.from}
        </p>
      </div>
      {/* Reply */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="mb-2 text-sm font-medium text-slate-700">Reply</p>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply here..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          rows={4}
        />
        <div className="mt-3 flex items-center justify-between">
          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
            <span>📎</span> Attach File
          </button>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Save Draft
            </button>
            <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors">
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-3 text-5xl text-slate-300">💬</div>
      <p className="text-sm font-medium text-slate-400">
        Nothing is highlighted as you have chosen conversation
      </p>
      <p className="mt-1 text-xs text-slate-300">
        Select a message from the list to view its content
      </p>
    </div>
  );
}

// ─── Campaign Form ─────────────────────────────────────────────────────────────

function CampaignForm({
  title,
  existingCampaign,
  onBack,
}: {
  title: string;
  existingCampaign?: Partial<Campaign>;
  onBack: () => void;
}) {
  const [type, setType] = useState<CampaignType>(
    existingCampaign?.type ?? "Newsletter",
  );
  const [campaignTitle, setCampaignTitle] = useState(
    existingCampaign?.title ?? "",
  );
  const [subject, setSubject] = useState(existingCampaign?.subject ?? "");
  const [content, setContent] = useState(existingCampaign?.content ?? "");
  const [audience, setAudience] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>(
    existingCampaign?.products?.map((p) => p.id) ?? [],
  );

  const toggleProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const campaignTypes: CampaignType[] = ["Newsletter", "Promotion", "Discount"];
  const icons: Record<CampaignType, string> = {
    Newsletter: "✉️",
    Promotion: "📈",
    Discount: "📦",
  };

  return (
    <div className="flex min-h-0 flex-1 gap-6 overflow-auto p-6">
      {/* Left form */}
      <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Campaign Type */}
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Campaign Type
        </label>
        <div className="mb-5 grid grid-cols-3 gap-3">
          {campaignTypes.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-4 text-sm font-medium transition-all ${
                type === t
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              <span className="text-xl">{icons[t]}</span>
              {t}
            </button>
          ))}
        </div>

        {/* Title */}
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Campaign Title
        </label>
        <input
          value={campaignTitle}
          onChange={(e) => setCampaignTitle(e.target.value)}
          placeholder="Enter campaign title..."
          className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        {/* Subject */}
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Email Subject Line
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject..."
          className="mb-4 w-full rounded-lg border border-blue-400 bg-blue-50/30 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        {/* Content */}
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Message Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your message here..."
          rows={6}
          className="mb-4 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        {/* Audience */}
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Target Audience
        </label>
        <input
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="mb-6 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        <div className="flex gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-colors">
            ✈️ Send Campaign
          </button>
          <button
            onClick={onBack}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Right product catalog */}
      <div className="w-72 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Product Catalog</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {selectedProducts.length} selected
          </span>
        </div>
        <p className="mb-4 text-xs text-slate-400">
          Select products to feature in your campaign
        </p>

        <div className="space-y-2">
          {PRODUCTS.map((p) => {
            const sel = selectedProducts.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleProduct(p.id)}
                className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
                  sel
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400">{p.category}</p>
                    <p className="text-sm font-semibold text-blue-500">
                      {p.price}
                    </p>
                  </div>
                  {sel && <span className="text-blue-500 text-lg">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {selectedProducts.length > 0 && (
          <div className="mt-4 rounded-lg bg-green-50 py-2 text-center text-sm font-medium text-green-600">
            {selectedProducts.length} product
            {selectedProducts.length > 1 ? "s" : ""} linked
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Campaign Detail ───────────────────────────────────────────────────────────

function CampaignDetail({
  campaign,
  onBack,
  onEdit,
}: {
  campaign: Campaign;
  onBack: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            ← Back to Campaigns
          </button>
          <div className="flex-1" />
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            ✏️ Edit Campaign
          </button>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-start gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">
              {campaign.title}
            </h1>
            {campaign.status === "sent" && (
              <span className="mt-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                sent
              </span>
            )}
          </div>
          <p className="mb-6 text-sm text-slate-400">{campaign.type}</p>

          <div className="mb-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Email Subject
            </p>
            <p className="text-sm text-slate-700">{campaign.subject}</p>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Message Content
            </p>
            <div className="rounded-xl border-2 border-blue-400 bg-blue-50/20 p-4">
              {campaign.content.split("\n").map((line, i) => (
                <p
                  key={i}
                  className={`text-sm text-slate-700 ${line === "" ? "mt-3" : ""}`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Featured Products ({campaign.products.length})
            </p>
            <div className="grid grid-cols-2 gap-3">
              {campaign.products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <span className="text-3xl">{p.emoji}</span>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {p.name}
                  </p>
                  <p className="text-xs text-slate-400">{p.category}</p>
                  <p className="mt-1 text-sm font-bold text-blue-500">
                    {p.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Marketing Campaigns List ──────────────────────────────────────────────────

function CampaignsList({
  onNew,
  onView,
}: {
  onNew: () => void;
  onView: (c: Campaign) => void;
}) {
  const campaigns = [SENT_CAMPAIGN];
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div />
          <button
            onClick={onNew}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            ⊕ New Campaign
          </button>
        </div>
        <div className="space-y-3">
          {campaigns.map((c) => (
            <button
              key={c.id}
              onClick={() => onView(c)}
              className="w-full rounded-2xl bg-white p-5 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800">{c.title}</p>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-600">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {c.type} &bull; {c.subject}
                  </p>
                </div>
                <span className="text-slate-300">›</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

const Test = () => {
  const [tab, setTab] = useState<Tab>("Email");
  const [view, setView] = useState<View>("messages");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [editing, setEditing] = useState(false);

  const inCampaigns =
    view === "campaigns" || view === "campaignDetail" || view === "newCampaign";

  return (
    <div className="flex h-screen flex-col bg-slate-100 font-sans text-slate-900">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-6 py-4">
        <button
          onClick={() => {
            if (view === "campaignDetail" || view === "newCampaign")
              setView("campaigns");
          }}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700"
        >
          {view !== "messages" && "← "}
          {view === "campaigns" ||
          view === "campaignDetail" ||
          view === "newCampaign"
            ? "Marketing Campaigns"
            : "Messages"}
        </button>

        <div className="flex gap-2">
          {(["Email", "WhatsApp"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-blue-500 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t === "Email" ? "✉️" : "💬"} {t}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <button
          onClick={() => {
            if (inCampaigns) {
              setView("messages");
            } else {
              setView("campaigns");
              setSelectedCampaign(null);
            }
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
        >
          ✉️ Marketing Campaigns
        </button>
      </header>

      {/* Body */}
      <main className="flex min-h-0 flex-1 gap-0 px-6 pb-6">
        {/* Messages view */}
        {view === "messages" && (
          <>
            <div className="w-96 overflow-y-auto rounded-2xl bg-white shadow-sm">
              <MessageList
                messages={MESSAGES}
                selected={selectedMessage}
                onSelect={setSelectedMessage}
              />
            </div>
            <div className="ml-4 flex-1 rounded-2xl bg-white shadow-sm overflow-y-auto">
              {selectedMessage ? (
                <MessageDetail message={selectedMessage} />
              ) : (
                <EmptyDetail />
              )}
            </div>
          </>
        )}

        {/* Campaigns list */}
        {view === "campaigns" && (
          <div className="flex w-full flex-col rounded-2xl bg-transparent">
            <CampaignsList
              onNew={() => setView("newCampaign")}
              onView={(c) => {
                setSelectedCampaign(c);
                setView("campaignDetail");
              }}
            />
          </div>
        )}

        {/* Campaign detail */}
        {view === "campaignDetail" && selectedCampaign && !editing && (
          <div className="flex w-full rounded-2xl bg-slate-50">
            <CampaignDetail
              campaign={selectedCampaign}
              onBack={() => setView("campaigns")}
              onEdit={() => setEditing(true)}
            />
          </div>
        )}

        {/* Edit existing campaign */}
        {view === "campaignDetail" && selectedCampaign && editing && (
          <div className="flex w-full flex-col">
            <CampaignForm
              title="Edit Campaign"
              existingCampaign={selectedCampaign}
              onBack={() => setEditing(false)}
            />
          </div>
        )}

        {/* New campaign */}
        {view === "newCampaign" && (
          <div className="flex w-full flex-col">
            <CampaignForm
              title="Create New Campaign"
              onBack={() => setView("campaigns")}
            />
          </div>
        )}
      </main>
    </div>
  );
};
export default Test;
