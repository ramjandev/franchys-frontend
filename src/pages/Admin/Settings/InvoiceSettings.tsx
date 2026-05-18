import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InvoiceSettings = () => {
  return (
    <div className="p-8">
      <div className="mb-6 pb-4 border-b border-[#F1F5F9]">
        <h2 className="text-2xl font-bold text-[#111827] mb-1">
          Invoice Information
        </h2>
        <p className="text-sm text-[#5C7899]">
          Configure how your invoices and quotes are generated
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Invoice ID</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Currency</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Invoice Numbering</Label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" />
            <span className="text-sm text-[#111827]">Auto-generate invoice numbers sequentially</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Invoice Seed</Label>
          <Input defaultValue="1" className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
          <Label className="w-48 text-sm font-semibold text-[#111827] pt-2">Terms and Conditions</Label>
          <div className="flex-1">
            <textarea 
              className="w-full h-32 border border-[#E6EBF2] rounded-md p-3 text-sm outline-none focus:border-[#0077FF]"
            />
            <p className="text-xs text-[#A0B0C0] mt-1.5">These terms will appear at the bottom of your invoices</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Default Payment Terms</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Default Tax Rate (%)</Label>
          <Input defaultValue="8.00" className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Invoice Language</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="pt-6 border-t border-[#F1F5F9]">
          <Button className="h-10 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSettings;
