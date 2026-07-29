import { inputClass } from "@/pages/Login";
import {
  useGetInvoiceByIdQuery,
  useUpdateInvoiceMutation,
} from "@/store/invoice/invoiceAPI";
import { useGetPaymentTermsQuery } from "@/store/settings/paymentTerms/paymentTermAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import ModalAction from "../settings/ModalAction";
import ModalContainer from "../settings/ModalContainer";
import CommonHeader from "../shared/CommonHeader";
import CommonSelect from "../shared/CommonSelect";
import VideoSkeleton from "../shared/loading/VideoSkeleton";

interface PaymentModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceId: string;
}

const paymentSchema = z.object({
  paymentTermId: z.string().min(1, "Payment method is required"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const PaymentModal: React.FC<PaymentModalProps> = ({
  setShowModal,
  invoiceId,
}) => {
  const { data, isLoading } = useGetInvoiceByIdQuery(invoiceId);
  const invoice = data?.data;
  const balance = invoice ? Number(invoice.amountDue) : 0;
  const { data: paymentTerms } = useGetPaymentTermsQuery();

  const paymentMethods =
    paymentTerms?.data?.map((paymentTerm) => ({
      label: paymentTerm.name,
      value: paymentTerm.id,
    })) ?? [];

  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  });

  const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();

  const onSubmit = async (values: PaymentFormValues) => {
    try {
      await updateInvoice({
        id: invoiceId,
        data: { paymentTermId: values.paymentTermId },
      }).unwrap();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update invoice payment term", err);
    }
  };

  if (isLoading || !invoice) {
    return (
      <ModalContainer close={() => setShowModal(false)} title="Process Payment">
        <VideoSkeleton />
      </ModalContainer>
    );
  }

  return (
    <ModalContainer close={() => setShowModal(false)} title="Process Payment">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className=" space-y-1">
              <CommonHeader size="sm" className="text-[#45556C]!">
                Invoice
              </CommonHeader>
              <CommonHeader className="text-[#45556C]!">
                {invoice.invoiceNumber}
              </CommonHeader>
            </div>
            <div className=" space-y-1">
              <CommonHeader size="sm" className="text-[#45556C]!">
                Balance
              </CommonHeader>
              <CommonHeader size="xl" className="text-[#E7000B]!">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </CommonHeader>
            </div>
          </div>

          <div className="space-y-2">
            <label className={inputClass.label}>Method</label>

            <Controller
              control={control}
              name="paymentTermId"
              render={({ field }) => (
                <CommonSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  item={paymentMethods}
                  placeholder="Select a payment method"
                  className="w-full! "
                />
              )}
            />
            {errors.paymentTermId && (
              <p className="text-xs text-red-500">
                {errors.paymentTermId.message}
              </p>
            )}
          </div>
        </div>

        <ModalAction
          close={() => setShowModal(false)}
          create="Process Payment"
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isUpdating}
          loadingText="Processing..."
        />
      </form>
    </ModalContainer>
  );
};

export default PaymentModal;
