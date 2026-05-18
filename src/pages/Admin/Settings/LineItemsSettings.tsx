import { Button } from "@/components/ui/button";

const LineItemsSettings = () => {
  return (
    <div className="p-8">
      <div className="mb-6 pb-4 border-b border-[#F1F5F9]">
        <h2 className="text-2xl font-bold text-[#111827] mb-1">
          Customize Your Line Items
        </h2>
        <p className="text-sm text-[#5C7899]">
          Customize the default columns you would like to use in your line items. You will have the ability to customize line item columns on individual quotes/invoices as well.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          <h3 className="text-lg font-bold text-[#111827]">Default Line Item Columns</h3>
          
          <div className="space-y-4">
            {[
              { id: "qty", label: "Quantity", desc: "Number of items to be produced", checked: true },
              { id: "item", label: "Item #", desc: "Product or item number", checked: false },
              { id: "cat", label: "Category dropdown", desc: "Organize items by category", checked: false },
              { id: "desc", label: "Description", desc: "Detailed product description", checked: true },
              { id: "color", label: "Color", desc: "Product color option", checked: false },
              { id: "markup", label: "Markup %", desc: "Markup percentage for pricing", checked: false },
              { id: "price", label: "Price", desc: "Unit price per item", checked: true },
            ].map((col) => (
              <label key={col.id} className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  defaultChecked={col.checked}
                  className="mt-1 rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" 
                />
                <div>
                  <div className="text-sm font-semibold text-[#111827] group-hover:text-[#0077FF] transition-colors">{col.label}</div>
                  <div className="text-xs text-[#5C7899] mt-0.5">{col.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#111827]">Sizing Options</h3>
            <p className="text-xs text-[#5C7899] mt-1">Select the sizes you want available for your products:</p>
          </div>

          <div className="space-y-4">
            {/* Adult Sizes */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#0077FF] uppercase tracking-wider mb-3">Adult Sizes</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size, idx) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked={idx < 5}
                      className="rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" 
                    />
                    <span className="text-sm font-medium text-[#111827]">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Youth Sizes */}
            <div className="bg-[#F0FDF4] border border-[#A7F3D0] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#10B981] uppercase tracking-wider mb-3">Youth Sizes</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Youth XS", "Youth S", "Youth M", "Youth L", "Youth XL"].map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-[#A0B0C0] text-[#10B981] focus:ring-[#10B981]" 
                    />
                    <span className="text-sm font-medium text-[#111827]">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Toddler Sizes */}
            <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#9333EA] uppercase tracking-wider mb-3">Toddler Sizes</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["2T", "3T", "4T", "5T", "6T"].map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-[#A0B0C0] text-[#9333EA] focus:ring-[#9333EA]" 
                    />
                    <span className="text-sm font-medium text-[#111827]">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Baby/Infant Sizes */}
            <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#E11D48] uppercase tracking-wider mb-3">Baby / Infant Sizes</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Newborn", "3 Months", "6 Months", "9 Months", "12 Months", "18 Months", "24 Months"].map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-[#A0B0C0] text-[#E11D48] focus:ring-[#E11D48]" 
                    />
                    <span className="text-sm font-medium text-[#111827]">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 mt-4 border-t border-[#F1F5F9]">
        <Button className="h-10 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg">
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default LineItemsSettings;
