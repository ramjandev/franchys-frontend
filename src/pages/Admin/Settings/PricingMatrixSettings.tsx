import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const matricesData = [
  { id: 1, name: "T-Shirt Pricing", type: "Apparel" },
  { id: 2, name: "Embroidery Pricing", type: "Decoration" },
  { id: 3, name: "Screen Printing", type: "Decoration" },
  { id: 4, name: "Banners & Signs", type: "Signage" },
];

const PricingMatrixSettings = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8 relative">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-1">
            Pricing Matrix
          </h2>
          <p className="text-sm text-[#5C7899]">
            Create pricing matrices for different products and services with quantity-based pricing.
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="h-10 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white rounded-lg gap-2 font-medium shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Matrix
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matricesData.map((matrix) => (
          <div key={matrix.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 border border-[#F1F5F9] cursor-pointer hover:border-[#0077FF] transition-colors">
            <h3 className="font-bold text-[#111827] text-base mb-1">{matrix.name}</h3>
            <p className="text-sm text-[#A0B0C0]">{matrix.type}</p>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#0077FF] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Create New Pricing Matrix</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#111827]">Matrix Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Hoodie Pricing" 
                  className="w-full h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#111827]">Product Type</label>
                <input 
                  type="text" 
                  className="w-full h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]"
                />
              </div>
            </div>

            <div className="bg-[#F8FAFC] px-6 py-4 flex items-center justify-end gap-3 border-t border-[#F1F5F9]">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-[#5C7899] hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#053F7A] text-white text-sm font-medium rounded-lg hover:bg-[#042f5a] transition-colors">
                Create Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingMatrixSettings;
