import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ShopSettings = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#111827] mb-6 pb-4 border-b border-[#F1F5F9]">
        Shop Information
      </h2>

      <div className="max-w-3xl space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
          <Label className="w-48 text-sm font-semibold text-[#111827] pt-2">Logo</Label>
          <div>
            <Button variant="outline" className="h-8 px-4 text-xs font-medium border-[#E6EBF2] bg-[#F8FAFC]">
              Choose File
            </Button>
            <p className="text-xs text-[#A0B0C0] mt-2">Recommended size for logos are 600px by 300px using jpg, gif, or png format</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Company Name</Label>
          <Input defaultValue="Printavo" className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
          <Label className="w-48 text-sm font-semibold text-[#111827] pt-2">Company Email</Label>
          <div className="flex-1">
            <Input defaultValue="info@makservius.com" className="h-10 border-[#E6EBF2]" />
            <p className="text-xs text-[#A0B0C0] mt-1.5">This is used when a customer replies to an invoice being emailed out.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Address</Label>
          <Input defaultValue="1102 Pontiac Avenue" className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Address</Label>
          <Input placeholder="Apartment, suite, etc. (optional)" className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">City</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">State</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Zip</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Country</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Phone</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Your Website</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
          <Label className="w-48 text-sm font-semibold text-[#111827] pt-2">Custom URL Branding</Label>
          <div className="flex-1">
            <Input defaultValue="makservius" className="h-10 border-[#E6EBF2]" />
            <p className="text-xs text-[#A0B0C0] mt-1.5">Enter your company name. Resulting example: http://shop-name.printavo.com/invoice/123</p>
          </div>
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

export default ShopSettings;
