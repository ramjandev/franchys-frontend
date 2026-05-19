import CheckboxField from "@/components/shared/CheckboxField";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { Save } from "lucide-react";

const LineItemsSettings = () => {
  return (
    <div className="">
      <div className="mb-6 pb-4 border-b border-border">
        <CommonHeader size="2xl" className="font-medium! ">
          Customize Your Line Items
        </CommonHeader>
        <CommonHeader size="sm">
          Customize the default columns you would like to use in your line
          items. You will have the ability to customize line item columns on
          individual quotes/invoices as well.
        </CommonHeader>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-4 sm:space-y-6">
          <CommonHeader size="lg"> Default Line Item Columns</CommonHeader>

          <div className="space-y-4">
            {[
              {
                id: "qty",
                label: "Quantity",
                desc: "Number of items to be produced",
                checked: true,
              },
              {
                id: "item",
                label: "Item #",
                desc: "Product or item number",
                checked: false,
              },
              {
                id: "cat",
                label: "Category dropdown",
                desc: "Organize items by category",
                checked: false,
              },
              {
                id: "desc",
                label: "Description",
                desc: "Detailed product description",
                checked: true,
              },
              {
                id: "color",
                label: "Color",
                desc: "Product color option",
                checked: false,
              },
              {
                id: "markup",
                label: "Markup %",
                desc: "Markup percentage for pricing",
                checked: false,
              },
              {
                id: "price",
                label: "Price",
                desc: "Unit price per item",
                checked: true,
              },
            ].map((col) => (
              <CheckboxField
                key={col.id}
                label={col.label}
                description={col.desc}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="mb-4">
            <CommonHeader size="lg">Sizing Options</CommonHeader>
            <CommonHeader size="sm">
              Select the sizes you want available for your products:
            </CommonHeader>
          </div>

          <div className="space-y-4">
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#1447E6] uppercase tracking-wider mb-3">
                Adult Sizes
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"].map(
                  (size, idx) => (
                    <CheckboxField key={idx} label={size} />
                  ),
                )}
              </div>
            </div>

            <div className="bg-[#ECFEFF] border border-[#A5F3FC] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#0891B2] uppercase tracking-wider mb-3">
                Youth Sizes
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Youth XS", "Youth S", "Youth M", "Youth L", "Youth XL"].map(
                  (size, idx) => (
                    <CheckboxField key={idx} label={size} />
                  ),
                )}
              </div>
            </div>

            <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-3">
                Toddler Sizes
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["2T", "3T", "4T", "5T", "6T"].map((size) => (
                  <CheckboxField key={size} label={size} />
                ))}
              </div>
            </div>

            <div className="bg-[#FDF2F8] border border-[#F9A8D4] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#BE185D] uppercase tracking-wider mb-3">
                Baby / Infant Sizes
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Newborn",
                  "3 Months",
                  "6 Months",
                  "9 Months",
                  "12 Months",
                  "18 Months",
                  "24 Months",
                ].map((size) => (
                  <CheckboxField key={size} label={size} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-border">
        <CommonButton className="bg-[#00A63E]! text-white">
          <Save size={15} />
          Save changes
        </CommonButton>
      </div>
    </div>
  );
};

export default LineItemsSettings;
