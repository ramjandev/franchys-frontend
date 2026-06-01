import { inputClass } from "@/pages/Login";
import CheckboxField from "../shared/CheckboxField";
import CommonSelect from "../shared/CommonSelect";

const PaymentTermsCard = () => {
  return (
    <div className="rounded-[13.161px] border-[1.103px] border-[#BEDBFF] bg-gradient-to-br from-[#EFF6FF] to-[#F5F3FF] p-6">
      <h2 className="text-sm font-bold text-[#111827] mb-4">Payment Terms</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className={inputClass.label}>Credit Limit</label>
          <input placeholder="$0.00" className={inputClass.input} />
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>Payment Terms</label>
          <CommonSelect
            item={[
              { label: "Net 30", value: "Net 30" },
              { label: "Net 60", value: "Net 60" },
              { label: "Due on Receipt", value: "Due on Receipt" },
            ]}
            value="Net 30"
            onValueChange={(e) => console.log(e)}
            placeholder="Net 30"
            className="w-full! "
          />
        </div>

        <CheckboxField
          label="Tax-Exempt Customer"
          description="Check this if the customer is exempt from sales tax"
        />
      </div>
    </div>
  );
};

export default PaymentTermsCard;
