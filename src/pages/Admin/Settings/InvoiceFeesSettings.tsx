import AddFeeModal from "@/components/settings/AddFeeModal";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { Save } from "lucide-react";
import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";

const feesData = [
  { id: 1, name: "Setup Fee", amount: "$50.00", taxed: "No", default: "No" },
  {
    id: 2,
    name: "Rush Order Fee",
    amount: "$100.00",
    taxed: "No",
    default: "No",
  },
  {
    id: 3,
    name: "Shipping & Handling",
    amount: "$25.00",
    taxed: "No",
    default: "No",
  },
  { id: 4, name: "Design Fee", amount: "$75.00", taxed: "No", default: "No" },
];

const InvoiceFeesSettings = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="">
      <div className="mb-6 pb-4 border-b border-border flex flex-col md:flex-row justify-between items-start gap-5">
        <div>
          <CommonHeader size="2xl" className="font-medium! ">
            Invoice Fees
          </CommonHeader>
          <CommonHeader size="sm">
            Create standard fees that can be used across any invoice and set
            default fees that will appear on every new invoice.
          </CommonHeader>
        </div>
        <CommonButton onClick={() => setShowModal(true)} variant="gradient">
          <GoPlusCircle /> Add New Fee
        </CommonButton>
      </div>

      <div className="bg-white rounded-xl border border-[#F1F5F9] overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#314158] bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/3">Name</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Taxed</th>
                <th className="px-6 py-4 font-semibold">Default</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {feesData.map((fee) => (
                <tr
                  key={fee.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-[#111827] font-medium">
                    {fee.name}
                  </td>
                  <td className="px-6 py-4 text-[#314158]">{fee.amount}</td>
                  <td className="px-6 py-4 text-[#314158]">{fee.taxed}</td>
                  <td className="px-6 py-4 text-[#314158]">{fee.default}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-skyBlue font-semibold text-xs hover:underline mr-3 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button className="text-[#E7000B] font-semibold text-xs hover:underline cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pt-6 mt-6 border-t border-border">
        <CommonButton className="bg-[#00A63E]! text-white">
          <Save size={15} />
          Save changes
        </CommonButton>
      </div>

      {showModal && <AddFeeModal setShowModal={setShowModal} />}
    </div>
  );
};

export default InvoiceFeesSettings;
