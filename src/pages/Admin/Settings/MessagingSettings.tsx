import CardContainer from "@/components/shared/CardContainer";
import CheckboxField from "@/components/shared/CheckboxField";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { inputClass } from "@/pages/Login";
import { Save } from "lucide-react";
const notifications = [
  {
    label: "Send quote notifications",
    description: "Notify customers when a new quote is created",
  },
  {
    label: "Send invoice notifications",
    description: "Email customers when invoices are generated",
  },
  {
    label: "Send payment reminders",
    description: "Automatic reminders for overdue invoices",
  },
  {
    label: "Send order status updates",
    description: "Keep customers informed about production progress",
  },
];
const MessagingSettings = () => {
  return (
    <div className="">
      <div className="mb-6 pb-4 border-b border-border flex justify-between">
        <div>
          <CommonHeader size="2xl" className="font-medium! ">
            Message Settings
          </CommonHeader>
          <CommonHeader size="sm">
            Configure email signature and messaging templates
          </CommonHeader>
        </div>
      </div>

      <div className=" space-y-6">
        <CardContainer>
          <div className="spacey-2 mb-5">
            <CommonHeader size="lg">Email Signature</CommonHeader>
            <CommonHeader size="sm">
              Create your email signature that will appear on the bottom of
              every message you send.
            </CommonHeader>
          </div>
          <textarea
            placeholder="Enter your email signature..."
            className={inputClass.input}
            rows={6}
          />

          <CommonButton variant="gradient" className="mt-5">
            Update Signature
          </CommonButton>
        </CardContainer>

        <CardContainer>
          <div className="spacey-2 mb-5">
            <CommonHeader size="lg">Messaging Templates</CommonHeader>
            <CommonHeader size="sm">
              Sending out similar messages to customers? You can customize
              templates to use when sending messages to customers. Create as
              many as you'd like to become more efficient.
            </CommonHeader>
          </div>

          <CommonButton variant="gradient" className="mt-5">
            Email Templates
          </CommonButton>
        </CardContainer>

        <CardContainer className="">
          <CommonHeader size="lg" className="mb-4">
            Email Notifications
          </CommonHeader>

          <div className="space-y-3">
            {notifications.map((n) => (
              <CheckboxField
                key={n.label}
                label={n.label}
                description={n.description}
              />
            ))}
          </div>
        </CardContainer>

        <div className="pt-6 mt-6 border-t border-border">
          <CommonButton className="bg-[#00A63E]! text-white">
            <Save size={15} />
            Save changes
          </CommonButton>
        </div>
      </div>
    </div>
  );
};

export default MessagingSettings;
