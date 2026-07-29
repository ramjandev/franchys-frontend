import Approval from "@/components/admin/quotes/Approval";
import CreateQuoteForm from "@/components/admin/quotes/CreateQuoteForm";
import MessagesForQuote from "@/components/admin/quotes/MessagesForQuote";
import PaymentForQuote from "@/components/admin/quotes/PaymentForQuote";
import QuoteTabs from "@/components/admin/quotes/QuoteTabs";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import {
  CheckCircle2,
  CreditCard,
  MessageSquare,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const CreateQuote = () => {
  const [activeTab, setActiveTab] = useState("Quote Details");
  const { id: quoteId } = useParams();
  const tabs = [
    { name: "Quote Details", icon: RefreshCcw },
    { name: "Approval", icon: CheckCircle2 },
    { name: "Messages", icon: MessageSquare },
    { name: "Payment", icon: CreditCard },
  ];
  const isEdit = !!quoteId;
  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardTopSection
        title={isEdit ? "Edit Quote" : "Create New Quote"}
        description={
          isEdit
            ? "Update an existing quote."
            : "Build a quote and send it to your customer."
        }
        backButton
      />

      <div className={activeTab === "Quote Details" ? "w-full" : "max-w-210"}>
        <QuoteTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      {activeTab === "Quote Details" && <CreateQuoteForm />}
      <div className="max-w-210">
        {activeTab === "Approval" && <Approval />}
        {activeTab === "Messages" && <MessagesForQuote />}
        {activeTab === "Payment" && <PaymentForQuote />}
      </div>
    </div>
  );
};

export default CreateQuote;
