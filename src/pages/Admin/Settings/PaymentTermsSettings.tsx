import PaymentTermModal from "@/components/settings/PaymentTermModal";
import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import IconActionButton from "@/components/shared/IconActionButton";
import DashboardCardSkeleton from "@/components/shared/loading/DashboardCardSkeleton";
import { loadingArray } from "@/lib/utils";
import {
  useDeletePaymentTermMutation,
  useGetPaymentTermsQuery,
} from "@/store/settings/paymentTerms/paymentTermAPI";
import { PaymentTerm } from "@/store/settings/paymentTerms/types/paymentTermTypes";
import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";

const PaymentTermsSettings = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingTerm, setEditingTerm] = useState<PaymentTerm | undefined>();

  const { data, isLoading } = useGetPaymentTermsQuery();
  const [deletePaymentTerm, { isLoading: isDeleting, originalArgs }] =
    useDeletePaymentTermMutation();

  const termsData = data?.data ?? [];

  const openAdd = () => {
    setEditingTerm(undefined);
    setShowModal(true);
  };

  const openEdit = (e: React.MouseEvent, term: PaymentTerm) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingTerm(term);
    setShowModal(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deletePaymentTerm(id).unwrap();
    } catch (err) {
      console.error("Failed to delete payment term", err);
    }
  };

  return (
    <div className="">
      <div className="mb-6 pb-4 border-b border-border flex flex-col md:flex-row justify-between items-start gap-5">
        <div>
          <CommonHeader size="2xl" className="font-medium! ">
            Payment Terms
          </CommonHeader>
          <CommonHeader size="sm">
            Define payment terms and deposit requirements used on your invoices.
          </CommonHeader>
        </div>
        <CommonButton onClick={openAdd}>
          <GoPlusCircle size={15} className="shrink-0" /> Add Payment Term
        </CommonButton>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingArray(6).map((_, index) => (
            <DashboardCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {termsData.length === 0 && (
            <p className="text-sm text-[#62748E] col-span-full">
              No payment terms yet. Create your first one.
            </p>
          )}
          {termsData.map((term) => (
            <CardContainer
              key={term.id}
              size="sm"
              className={`relative group ${term.isArchived ? "opacity-60" : ""}`}
            >
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <IconActionButton
                  title="Edit term"
                  onClick={(e) =>
                    openEdit(e as unknown as React.MouseEvent, term)
                  }
                />
                <IconActionButton
                  title="Delete term"
                  variant="delete"
                  isLoading={isDeleting && originalArgs === term.id}
                  onClick={(e) =>
                    handleDelete(e as unknown as React.MouseEvent, term.id)
                  }
                />
              </div>

              <CommonHeader size="lg">{term.name}</CommonHeader>
              <CommonHeader size="sm" className="text-[#62748E]!">
                {term.paymentDaysAllowed} days &bull; {term.depositPercent}%
                deposit
              </CommonHeader>
            </CardContainer>
          ))}
        </div>
      )}

      {showModal && (
        <PaymentTermModal
          setShowModal={setShowModal}
          selectedTerm={editingTerm}
        />
      )}
    </div>
  );
};

export default PaymentTermsSettings;
