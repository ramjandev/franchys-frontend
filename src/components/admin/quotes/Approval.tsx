import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import { inputClass } from "@/pages/Login";
import { FiCheckCircle } from "react-icons/fi";

const Approval = () => {
  return (
    <CardContainer className="">
      <CommonHeader size="lg" className="mb-2">
        Quote Approval
      </CommonHeader>
      <CommonHeader className="mb-6">
        Configure approval settings and message for the customer.
      </CommonHeader>

      <div className="space-y-2 mb-6">
        <label className={inputClass.label}>Approval Message</label>
        <textarea
          className={inputClass.input}
          placeholder="Enter a message for the customer when they approve this quote..."
          rows={6}
        />
      </div>

      <div className="bg-[#EFF6FF] border border-[#BEDBFF] rounded-lg p-6">
        <CommonHeader size="lg" className="text-[#1C398E]!">
          Customer Approval Process
        </CommonHeader>
        <p className={"text-sm text-[#1447E6] mb-4"}>
          When the customer receives the quote, they will see:
        </p>
        <ul className="space-y-2 text-sm text-[#0077FF]">
          <li className="flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4" /> All line items with pricing
            and imprint details
          </li>
          <li className="flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4" /> Total amount and payment terms
          </li>
          <li className="flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4" /> Approve or Decline buttons
          </li>
        </ul>
      </div>
    </CardContainer>
  );
};

export default Approval;
