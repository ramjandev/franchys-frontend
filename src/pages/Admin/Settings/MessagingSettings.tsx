import { Button } from "@/components/ui/button";

const MessagingSettings = () => {
  return (
    <div className="p-8">
      <div className="mb-6 pb-4 border-b border-[#F1F5F9]">
        <h2 className="text-2xl font-bold text-[#111827] mb-1">
          Message Settings
        </h2>
        <p className="text-sm text-[#5C7899]">
          Configure email signature and messaging templates
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Email Signature */}
        <div className="bg-white border border-[#E6EBF2] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-base font-bold text-[#111827] mb-2">Email Signature</h3>
          <p className="text-sm text-[#5C7899] mb-4">Create your email signature that will appear on the bottom of every message you send.</p>
          <textarea 
            placeholder="Enter your email signature..."
            className="w-full h-32 border border-[#E6EBF2] rounded-md p-3 text-sm outline-none focus:border-[#0077FF] mb-4"
          />
          <Button className="h-9 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white text-sm rounded-lg">
            Update Signature
          </Button>
        </div>

        {/* Messaging Templates */}
        <div className="bg-white border border-[#E6EBF2] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-base font-bold text-[#111827] mb-2">Messaging Templates</h3>
          <p className="text-sm text-[#5C7899] mb-4">
            Sending out similar messages to customers? You can customize templates to use when sending messages to customers. Create as many as you'd like to become more efficient.
          </p>
          <Button className="h-9 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white text-sm rounded-lg">
            Email Templates
          </Button>
        </div>

        {/* Email Notifications */}
        <div className="bg-white border border-[#E6EBF2] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-base font-bold text-[#111827] mb-4">Email Notifications</h3>
          
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" />
              <div>
                <div className="text-sm font-semibold text-[#111827]">Send quote notifications</div>
                <div className="text-xs text-[#5C7899] mt-0.5">Notify customers when a new quote is created</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" />
              <div>
                <div className="text-sm font-semibold text-[#111827]">Send invoice notifications</div>
                <div className="text-xs text-[#5C7899] mt-0.5">Email customers when invoices are generated</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" />
              <div>
                <div className="text-sm font-semibold text-[#111827]">Send payment reminders</div>
                <div className="text-xs text-[#5C7899] mt-0.5">Automatic reminders for overdue invoices</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" />
              <div>
                <div className="text-sm font-semibold text-[#111827]">Send order status updates</div>
                <div className="text-xs text-[#5C7899] mt-0.5">Keep customers informed about production progress</div>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-2">
          <Button className="h-10 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagingSettings;
