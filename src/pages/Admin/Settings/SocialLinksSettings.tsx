import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SocialLinksSettings = () => {
  return (
    <div className="p-8">
      <div className="mb-6 pb-4 border-b border-[#F1F5F9]">
        <h2 className="text-2xl font-bold text-[#111827] mb-1">
          Social Links
        </h2>
        <p className="text-sm text-[#5C7899]">
          Connect your social media profiles
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#111827]">Facebook</Label>
          <Input placeholder="https://facebook.com/yourpage" className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#111827]">Instagram</Label>
          <Input placeholder="https://instagram.com/yourprofile" className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#111827]">Tiktok</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#111827]">Whatsapp</Label>
          <Input placeholder="https://youtube.com/@yourchannel" className="h-10 border-[#E6EBF2]" />
          {/* Note: The mockup has a typo "Whatsapp" but placeholder is youtube.com */}
        </div>

        <div className="pt-6 mt-4">
          <Button className="h-10 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksSettings;
