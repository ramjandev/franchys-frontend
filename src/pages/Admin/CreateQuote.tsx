import Approval from "@/components/admin/quotes/Approval";
import MessagesForQuote from "@/components/admin/quotes/MessagesForQuote";
import PaymentForQuote from "@/components/admin/quotes/PaymentForQuote";
import QuoteDetails from "@/components/admin/quotes/QuoteDetails";
import QuoteTabs from "@/components/admin/quotes/QuoteTabs";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import {
  CheckCircle2,
  CreditCard,
  MessageSquare,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";

const CreateQuote = () => {
  const [activeTab, setActiveTab] = useState("Quote Details");

  const tabs = [
    { name: "Quote Details", icon: RefreshCcw },
    { name: "Approval", icon: CheckCircle2 },
    { name: "Messages", icon: MessageSquare },
    { name: "Payment", icon: CreditCard },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardTopSection
        title="Create New Quote"
        description="Build a quote and send it to your customer."
        backButton
      />

      <div className={activeTab === "Quote Details" ? "w-full" : "max-w-210"}>
        <QuoteTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      {activeTab === "Quote Details" && <QuoteDetails />}
      <div className="max-w-210">
        {activeTab === "Approval" && <Approval />}
        {activeTab === "Messages" && <MessagesForQuote />}
        {activeTab === "Payment" && <PaymentForQuote />}
      </div>
    </div>
  );
};

export default CreateQuote;
