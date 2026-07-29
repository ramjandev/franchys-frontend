import ModalAction from "@/components/settings/ModalAction";
import ModalContainer from "@/components/settings/ModalContainer";
import { inputClass } from "@/pages/Login";
import {
  useCreatePaymentTermMutation,
  useUpdatePaymentTermMutation,
} from "@/store/settings/paymentTerms/paymentTermAPI";
import { PaymentTerm } from "@/store/settings/paymentTerms/types/paymentTermTypes";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

export const paymentTermSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  paymentDaysAllowed: z.number().min(0, "Must be 0 or greater"),
  depositPercent: z.number().min(0).max(100, "Must be between 0 and 100"),
});

export type PaymentTermFormValues = z.infer<typeof paymentTermSchema>;
interface PaymentTermModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTerm?: PaymentTerm;
}

const PaymentTermModal: React.FC<PaymentTermModalProps> = ({
  setShowModal,
  selectedTerm,
}) => {
  const isEditMode = Boolean(selectedTerm);

  const [createPaymentTerm, { isLoading: isCreating }] =
    useCreatePaymentTermMutation();
  const [updatePaymentTerm, { isLoading: isUpdating }] =
    useUpdatePaymentTermMutation();

  const {
    register,

    handleSubmit,
    formState: { errors },
  } = useForm<PaymentTermFormValues>({
    resolver: zodResolver(paymentTermSchema),
    defaultValues: {
      name: selectedTerm?.name ?? "",
      paymentDaysAllowed: selectedTerm?.paymentDaysAllowed ?? 30,
      depositPercent: selectedTerm ? Number(selectedTerm.depositPercent) : 0,
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (values: PaymentTermFormValues) => {
    try {
      if (isEditMode && selectedTerm) {
        await updatePaymentTerm({
          id: selectedTerm.id,
          data: values,
        }).unwrap();
      } else {
        await createPaymentTerm(values).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save payment term", err);
    }
  };

  return (
    <ModalContainer
      close={() => setShowModal(false)}
      title={isEditMode ? "Edit Payment Term" : "Add New Payment Term"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-4">
          <div>
            <label className={inputClass.label}>Name</label>
            <input
              type="text"
              placeholder="e.g., Net 30"
              className={inputClass.input}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={inputClass.label}>Payment Days Allowed</label>
              <input
                type="number"
                min={0}
                className={inputClass.input}
                {...register("paymentDaysAllowed", { valueAsNumber: true })}
              />
              {errors.paymentDaysAllowed && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.paymentDaysAllowed.message}
                </p>
              )}
            </div>

            <div>
              <label className={inputClass.label}>Deposit (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                className={inputClass.input}
                {...register("depositPercent", { valueAsNumber: true })}
              />
              {errors.depositPercent && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.depositPercent.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <ModalAction
          close={() => setShowModal(false)}
          create={isEditMode ? "Save Changes" : "Add Payment Term"}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
        />
      </form>
    </ModalContainer>
  );
};

export default PaymentTermModal;
