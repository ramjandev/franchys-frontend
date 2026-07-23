import AddFeeModal from "@/components/settings/AddFeeModal";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import IconActionButton from "@/components/shared/IconActionButton";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import {
  useDeleteFeeMutation,
  useGetAllFeesQuery,
} from "@/store/settings/fees/feeAPI";
import { Fee } from "@/store/settings/fees/types/feeTypes";
import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";

const InvoiceFeesSettings = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const { data, isLoading } = useGetAllFeesQuery();

  const feesData = data?.data ?? [];
  const [deleteFee, { originalArgs }] = useDeleteFeeMutation();
  const handleClose = () => {
    setShowModal(false);
    setSelectedFee(null);
  };

  const handleEdit = (fee: Fee) => {
    setSelectedFee(fee);
    setShowModal(true);
  };
  const handleDelete = async (infId: string) => {
    try {
      await deleteFee(infId).unwrap();
    } catch {
      console.error("Failed to delete fee");
    }
  };

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
        <CommonButton
          onClick={() => {
            setShowModal(true);
            setSelectedFee(null);
          }}
        >
          <GoPlusCircle /> Add New Fee
        </CommonButton>
      </div>

      <LoadingStatus isLoading={isLoading} items={feesData} itemName="fees" />
      {!isLoading && feesData.length > 0 && (
        <div className="bg-white rounded-xl border border-[#F1F5F9] overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#314158] bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4 font-semibold w-1/3">Name</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Taxed</th>
                  <th className="px-6 py-4 font-semibold">Default</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {feesData.map((fee) => (
                  <tr
                    key={fee.infId}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-[#111827] font-medium">
                      {fee.feeName}
                    </td>
                    <td className="px-6 py-4 text-[#314158]">{fee.amount}</td>
                    <td className="px-6 py-4 text-[#314158]">
                      {fee.isTax ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-[#314158]">
                      {fee.isDefaultAutoAdd ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <IconActionButton
                        title="Edit"
                        onClick={() => handleEdit(fee)}
                        variant="edit"
                      />
                      <IconActionButton
                        title="Delete"
                        onClick={() => handleDelete(fee.infId)}
                        variant="delete"
                        isLoading={originalArgs === fee.infId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <AddFeeModal selectedFee={selectedFee!} close={handleClose} />
      )}
    </div>
  );
};

export default InvoiceFeesSettings;
