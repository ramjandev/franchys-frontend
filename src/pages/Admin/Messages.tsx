import { useState } from "react";
import { Plus, Mail, MessageCircle, X, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const campaignsData = [
  {
    id: 1,
    title: "Spring Sale - 20% Off Custom Patches",
    type: "Promotion",
    subject: "Don't miss out - Spring Sale - 20% Off Custom Patches",
    status: "sent",
    body: `Dear valued customer,

We're excited to share this exclusive offer with you! Spring Sale - 20% Off Custom Patches.

Check out our featured products below and take advantage of this limited-time offer.

Best regards,
The Team`,
    products: [
      { name: "Custom Embroidered Patches", category: "Patches", price: "$45.00", emoji: "📦" },
      { name: "Logo Design Service", category: "Services", price: "$120.00", emoji: "🎨" },
    ],
  },
  {
    id: 2,
    title: "Summer T-Shirt Newsletter",
    type: "Newsletter",
    subject: "Check out our new summer collection!",
    status: "draft",
    body: `Hi there,

Our new summer collection is here! Browse our latest custom t-shirts and hoodies.

Best regards,
The Team`,
    products: [],
  },
];

const productCatalog = [
  { name: "Custom Embroidered Patches", category: "Patches", price: "$45.00", emoji: "📦" },
  { name: "Logo Design Service", category: "Services", price: "$120.00", emoji: "🎨" },
  { name: "Custom T-Shirt Printing", category: "Apparel", price: "$25.00", emoji: "👕" },
  { name: "Business Cards (500 pack)", category: "Print", price: "$89.00", emoji: "📋" },
  { name: "Promotional Stickers", category: "Stickers", price: "$35.00", emoji: "⭐" },
  { name: "Banner Printing", category: "Print", price: "$150.00", emoji: "🖼" },
];

type CampaignType = "Newsletter" | "Promotion" | "Discount";

const Messages = () => {
  const [activeTab, setActiveTab] = useState<"Email" | "WhatsApp">("Email");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<typeof campaignsData[0] | null>(null);
  const [campaignType, setCampaignType] = useState<CampaignType>("Newsletter");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const toggleProduct = (name: string) => {
    setSelectedProducts((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const openCreate = () => {
    setSelectedCampaign(null);
    setCampaignType("Newsletter");
    setCampaignTitle("");
    setEmailSubject("");
    setMessageContent("");
    setSelectedProducts([]);
    setShowCreateModal(true);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard">
            <ArrowLeft className="w-5 h-5 text-[#5C7899] hover:text-[#111827]" />
          </Link>
          <h1 className="text-3xl font-semibold text-[#111827]">Marketing Campaigns</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={openCreate}
            className="h-10 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white rounded-lg gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
          <Button variant="outline" className="h-10 px-4 border-[#E6EBF2] text-[#5C7899] gap-2">
            <Mail className="w-4 h-4" />
            Marketing Campaigns
          </Button>
        </div>
      </div>

      {/* Tab row */}
      <div className="flex gap-2">
        {(["Email", "WhatsApp"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "bg-[#0077FF] text-white"
                : "bg-white border border-[#E6EBF2] text-[#5C7899] hover:bg-slate-50"
            }`}
          >
            {tab === "Email" ? <Mail className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {campaignsData.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => setSelectedCampaign(campaign)}
            className="bg-white rounded-xl border border-[#F1F5F9] shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-5 cursor-pointer hover:border-[#0077FF] transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-[#111827] text-sm leading-tight mb-1">{campaign.title}</h3>
                <span className="text-xs text-[#5C7899]">{campaign.type}</span>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  campaign.status === "sent"
                    ? "bg-[#D1FAE5] text-[#065F46]"
                    : "bg-[#F3F4F6] text-[#4B5563]"
                }`}
              >
                {campaign.status}
              </span>
            </div>
            <p className="text-xs text-[#A0B0C0] line-clamp-2">{campaign.subject}</p>
          </div>
        ))}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && !showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#111827]/30 backdrop-blur-sm pt-16 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mb-10">
            <div className="flex items-center justify-between p-6 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-sm text-[#0077FF] font-semibold hover:underline"
                >
                  ← Back to Campaigns
                </button>
              </div>
              <button className="h-9 px-4 border border-[#E6EBF2] rounded-lg text-sm font-semibold text-[#5C7899] hover:bg-slate-50 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Edit Campaign
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-[#111827]">{selectedCampaign.title}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46]">
                  {selectedCampaign.status}
                </span>
              </div>
              <p className="text-sm text-[#5C7899] mb-4">{selectedCampaign.type}</p>

              <div className="mb-4">
                <p className="text-xs font-bold text-[#A0B0C0] uppercase tracking-wider mb-1">Email Subject</p>
                <p className="text-sm text-[#111827]">{selectedCampaign.subject}</p>
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold text-[#A0B0C0] uppercase tracking-wider mb-1">Message Content</p>
                <p className="text-sm text-[#374151] whitespace-pre-line">{selectedCampaign.body}</p>
              </div>

              {selectedCampaign.products.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-[#A0B0C0] uppercase tracking-wider mb-3">
                    Featured Products ({selectedCampaign.products.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCampaign.products.map((p) => (
                      <div key={p.name} className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl p-4 border border-[#F1F5F9]">
                        <div className="text-3xl">{p.emoji}</div>
                        <div>
                          <p className="text-sm font-bold text-[#111827]">{p.name}</p>
                          <p className="text-xs text-[#A0B0C0]">{p.category}</p>
                          <p className="text-sm font-bold text-[#0077FF] mt-0.5">{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#111827]/30 backdrop-blur-sm pt-10 px-4 overflow-y-auto pb-10">
          <div className="flex gap-4 w-full max-w-5xl">
            {/* Form */}
            <div className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-[#F1F5F9]">
                <h2 className="text-xl font-bold text-[#111827]">Create New Campaign</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-[#5C7899]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-[#111827] mb-2 block">Campaign Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["Newsletter", "Promotion", "Discount"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setCampaignType(type)}
                        className={`h-16 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-sm font-semibold transition-colors ${
                          campaignType === type
                            ? "border-[#0077FF] bg-[#F5F8FF] text-[#0077FF]"
                            : "border-[#E6EBF2] text-[#5C7899] hover:border-[#A0B0C0]"
                        }`}
                      >
                        {type === "Newsletter" ? <Mail size={16} /> : type === "Promotion" ? <span className="text-base">📈</span> : <span className="text-base">🏷</span>}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#111827] mb-2 block">Campaign Title</label>
                  <input
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    placeholder="Enter campaign title..."
                    className="w-full h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#111827] mb-2 block">Email Subject Line</label>
                  <input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#111827] mb-2 block">Message Content</label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full h-36 border border-[#E6EBF2] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0077FF] resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#111827] mb-2 block">Target Audience</label>
                  <input
                    className="w-full h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 h-11 bg-[#0077FF] hover:bg-[#0060CE] text-white rounded-xl flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    Send Campaign
                  </Button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 h-11 border border-[#E6EBF2] rounded-xl text-sm font-semibold text-[#5C7899] hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Product Catalog Panel */}
            <div className="w-72 shrink-0 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <h3 className="font-bold text-[#111827] text-sm">Product Catalog</h3>
                {selectedProducts.length > 0 && (
                  <span className="text-xs font-bold bg-[#0077FF] text-white px-2 py-0.5 rounded-full">
                    {selectedProducts.length} selected
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A0B0C0] px-4 py-2">Select products to feature in your campaign</p>
              <div className="flex-1 overflow-y-auto divide-y divide-[#F8FAFC]">
                {productCatalog.map((product) => {
                  const isSelected = selectedProducts.includes(product.name);
                  return (
                    <div
                      key={product.name}
                      onClick={() => toggleProduct(product.name)}
                      className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                        isSelected ? "bg-[#F0F7FF] border-l-2 border-l-[#0077FF]" : "hover:bg-slate-50 border-l-2 border-l-transparent"
                      }`}
                    >
                      <div className="text-2xl shrink-0">{product.emoji}</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#111827] leading-tight">{product.name}</p>
                        <p className="text-xs text-[#A0B0C0]">{product.category}</p>
                        <p className="text-sm font-bold text-[#0077FF] mt-0.5">{product.price}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#0077FF] flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 12 10" width="10" height="10" fill="none" stroke="white" strokeWidth="2">
                            <polyline points="1 5 4.5 8.5 11 1" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {selectedProducts.length > 0 && (
                <div className="p-4 border-t border-[#F1F5F9] bg-[#F8FAFC]">
                  <p className="text-xs text-center text-[#0077FF] font-semibold">
                    {selectedProducts.length} products linked
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
