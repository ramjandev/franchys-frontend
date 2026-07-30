import ModalAction from "@/components/settings/ModalAction";
import ModalContainer from "@/components/settings/ModalContainer";
import { inputClass } from "@/pages/Login";
import { useSendCampaignMutation } from "@/store/campaign/campaignAPI";
import { SendCampaignPayload } from "@/store/campaign/types/campaignTypes";

import { useState } from "react";
import { z } from "zod";

interface PromotionalModalProps {
  close: () => void;
  selectedCustomerIds: string[];
}

const campaignSchema = z
  .object({
    subject: z
      .string()
      .trim()
      .min(1, "Subject is required")
      .max(150, "Subject must be under 150 characters"),
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(150, "Title must be under 150 characters"),
    messageContent: z.string().trim().min(1, "Message content is required"),
    promoCode: z.string().trim().optional(),
    sendToAll: z.boolean(),
    customerIds: z.array(z.string()),
  })
  .refine((data) => data.sendToAll || data.customerIds.length > 0, {
    message: "Select at least one customer or enable Send to All",
    path: ["customerIds"],
  });

type CampaignFormErrors = Partial<
  Record<keyof z.infer<typeof campaignSchema>, string>
>;

const PromotionalModal: React.FC<PromotionalModalProps> = ({
  close,
  selectedCustomerIds,
}) => {
  const [sendCampaign, { isLoading: isSubmitting }] = useSendCampaignMutation();

  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [errors, setErrors] = useState<CampaignFormErrors>({});

  const handleSubmit = async () => {
    const result = campaignSchema.safeParse({
      subject,
      title,
      messageContent,
      promoCode: promoCode || undefined,
      sendToAll,
      customerIds: selectedCustomerIds,
    });

    if (!result.success) {
      const fieldErrors: CampaignFormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof CampaignFormErrors;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const payload: SendCampaignPayload = result.data;

    try {
      await sendCampaign(payload).unwrap();
      close();
    } catch {}
  };

  return (
    <ModalContainer close={() => close()} title="Send Promotional Campaign">
      <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className={inputClass.label}>Email Subject</label>
          <input
            type="text"
            placeholder="e.g., Summer Sale — 20% Off Everything"
            className={inputClass.input}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          {errors.subject && (
            <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className={inputClass.label}>Campaign Title</label>
          <input
            type="text"
            placeholder="e.g., Summer Sale 2026"
            className={inputClass.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className={inputClass.label}>Message Content</label>
          <textarea
            placeholder="Write your promotional message..."
            rows={5}
            className={`${inputClass.input} resize-none`}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
          {errors.messageContent && (
            <p className="text-xs text-red-500 mt-1">{errors.messageContent}</p>
          )}
        </div>

        <div>
          <label className={inputClass.label}>Promo Code (optional)</label>
          <input
            type="text"
            placeholder="e.g., SUMMER20"
            className={inputClass.input}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
        </div>

        <div className="border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#0F172B]">Send to All</p>
            <p className="text-xs text-[#62748E] mt-0.5">
              {sendToAll
                ? "This campaign will be sent to every customer"
                : `This campaign will be sent to ${selectedCustomerIds.length} selected customer${
                    selectedCustomerIds.length === 1 ? "" : "s"
                  }`}
            </p>
          </div>
          <button
            onClick={() => setSendToAll((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              sendToAll ? "bg-[#155DFC]" : "bg-[#CBD5E1]"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                sendToAll ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        {errors.customerIds && (
          <p className="text-xs text-red-500 -mt-2">{errors.customerIds}</p>
        )}
      </form>

      <ModalAction
        close={() => close()}
        create="Send Campaign"
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </ModalContainer>
  );
};

export default PromotionalModal;
