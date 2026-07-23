import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { inputClass } from "@/pages/Login";
import { Send } from "lucide-react";
import { useState } from "react";

const messages = [
  {
    id: 1,
    sender: "John Smith",
    role: "Customer",
    isYou: false,
    time: "2026-05-10 2:30 PM",
    text: "Hi, I received the quote. Could you clarify the timeline for the project?",
  },
  {
    id: 2,
    sender: "Jackson D.",
    role: "You",
    isYou: true,
    time: "2026-05-10 3:15 PM",
    text: "Thank you for your question! The project timeline is estimated at 4-6 weeks from the start date. Let me know if you have any other questions.",
  },
  {
    id: 3,
    sender: "John Smith",
    role: "Customer",
    isYou: false,
    time: "2026-05-11 9:00 AM",
    text: "That sounds good. One more thing - is the payment plan flexible?",
  },
];

const MessagesForQuote = () => {
  const [message, setMessage] = useState("");

  return (
    <CardContainer className="">
      <CommonHeader size="lg" className="mb-2">
        Message Customer
      </CommonHeader>
      <CommonHeader className="mb-6">
        View conversation history and send messages to the customer along with
        this quote.
      </CommonHeader>
      <CommonHeader size="sm" className="mb-3 font-semibold text-[#111827]!">
        Conversation History
      </CommonHeader>

      <div className="border border-[#E6EBF2] rounded-xl p-3 bg-[#F8FAFC] space-y-3 mb-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`border rounded-lg p-4 ${
              msg.isYou
                ? "bg-[#EFF6FF] border-[#BFDBFE]"
                : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold  text-[#111827]!">
                  {msg.sender}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    msg.isYou
                      ? "text-[#155DFC] bg-transparent"
                      : "text-[#64748B] bg-[#F1F5F9]"
                  }`}
                >
                  {msg.role}
                </span>
              </div>
              <span className="text-xs text-[#64748B]">{msg.time}</span>
            </div>
            <p className="text-sm text-[#334155]">{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        <label className={inputClass.label}>New Message to Customer</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass.input}
          rows={6}
        />
      </div>

      <div className="border border-[#E2E8F0] rounded-lg p-3 text-sm text-[#5C7899] mb-6 bg-[#F8FAFC]">
        <span className="font-bold text-[#314158]">Your email signature</span>
        will be automatically added to the end of this message.
      </div>
      <CommonButton>
        <Send /> Send Message
      </CommonButton>
    </CardContainer>
  );
};

export default MessagesForQuote;
