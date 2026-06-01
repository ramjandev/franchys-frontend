import { Building2, User } from "lucide-react";

interface CustomerTabProps {
  customerType: "business" | "personal";
  setCustomerType: React.Dispatch<
    React.SetStateAction<"business" | "personal">
  >;
}
const CustomerTab: React.FC<CustomerTabProps> = ({
  customerType,
  setCustomerType,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
      <button
        onClick={() => setCustomerType("business")}
        className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors cursor-pointer ${
          customerType === "business"
            ? "border-[#3B82F6] bg-[#EFF6FF]"
            : "border-border bg-white hover:border-border-border"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Building2
            className={`w-5 h-5 ${customerType === "business" ? "text-[#3B82F6]" : "text-[#64748B]"}`}
          />
          <span
            className={`font-semibold ${customerType === "business" ? "text-[#3B82F6]" : "text-[#64748B]"}`}
          >
            Business Customer
          </span>
        </div>
        <p
          className={`text-xs ${customerType === "business" ? "text-[#3B82F6]" : "text-[#64748B]"}`}
        >
          Company or organization
        </p>
      </button>

      <button
        onClick={() => setCustomerType("personal")}
        className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors cursor-pointer ${
          customerType === "personal"
            ? "border-[#8B5CF6] bg-[#F5F3FF]"
            : "border-border bg-white hover:border-[#A0B0C0]"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <User
            className={`w-5 h-5 ${customerType === "personal" ? "text-[#8B5CF6]" : "text-[#64748B]"}`}
          />
          <span
            className={`font-semibold ${customerType === "personal" ? "text-[#8B5CF6]" : "text-[#64748B]"}`}
          >
            Personal Customer
          </span>
        </div>
        <p
          className={`text-xs ${customerType === "personal" ? "text-[#8B5CF6]" : "text-[#A0B0C0]"}`}
        >
          Events, gifts, personal orders
        </p>
      </button>
    </div>
  );
};

export default CustomerTab;
