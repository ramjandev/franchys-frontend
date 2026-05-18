import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfileSettings = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#111827] mb-6 pb-4 border-b border-[#F1F5F9]">
        Personal Information
      </h2>

      <div className="max-w-3xl space-y-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
          <Label className="w-48 text-sm font-semibold text-[#111827] pt-2">Avatar</Label>
          <div>
            <Button variant="outline" className="h-8 px-4 text-xs font-medium border-[#E6EBF2] bg-[#F8FAFC]">
              Choose File
            </Button>
            <p className="text-xs text-[#A0B0C0] mt-2">200 by 200px minimum size</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Name</Label>
          <Input defaultValue="Franchesca" className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Email</Label>
          <Input defaultValue="franchesca@printavo.com" className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Timezone</Label>
          <Input className="h-10 border-[#E6EBF2]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Tasks Reminder Emails</Label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" />
            <span className="text-sm text-[#5C7899]">Send a reminder email for tasks due that day</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Task Assigned Emails</Label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" />
            <span className="text-sm text-[#5C7899]">Send a reminder email when a task is assigned to you</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
          <Label className="w-48 text-sm font-semibold text-[#111827] pt-2">Change Password</Label>
          <div className="flex-1">
            <Input placeholder="Enter new password" type="password" className="h-10 border-[#E6EBF2]" />
            <p className="text-xs text-[#A0B0C0] mt-1.5">Minimum 9 characters</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <Label className="w-48 text-sm font-semibold text-[#111827]">Password Confirmation</Label>
          <Input placeholder="Confirm new password" type="password" className="h-10 border-[#E6EBF2]" />
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

export default ProfileSettings;
