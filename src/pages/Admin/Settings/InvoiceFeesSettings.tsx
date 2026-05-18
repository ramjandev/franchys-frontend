import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const feesData = [
  { id: 1, name: "Setup Fee", amount: "$50.00", taxed: "No", default: "No" },
  { id: 2, name: "Rush Order Fee", amount: "$100.00", taxed: "No", default: "No" },
  { id: 3, name: "Shipping & Handling", amount: "$25.00", taxed: "No", default: "No" },
  { id: 4, name: "Design Fee", amount: "$75.00", taxed: "No", default: "No" },
];

const InvoiceFeesSettings = () => {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-4 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-1">
            Invoice Fees
          </h2>
          <p className="text-sm text-[#5C7899]">
            Create standard fees that can be used across any invoice and set default fees that will appear on every new invoice.
          </p>
        </div>
        <Button className="h-10 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white rounded-lg gap-2 font-medium shrink-0">
          <Plus className="w-4 h-4" />
          Add New Fee
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#F1F5F9] overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#5C7899] bg-[#F8FAFC] border-b border-[#F1F5F9]">
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
                <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-[#111827] font-medium">{fee.name}</td>
                  <td className="px-6 py-4 text-[#5C7899]">{fee.amount}</td>
                  <td className="px-6 py-4 text-[#5C7899]">{fee.taxed}</td>
                  <td className="px-6 py-4 text-[#5C7899]">{fee.default}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#0077FF] font-semibold text-xs hover:underline mr-3">Edit</button>
                    <button className="text-[#E11D48] font-semibold text-xs hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-2">
        <Button className="h-10 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg">
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default InvoiceFeesSettings;
