import CheckboxField from "@/components/shared/CheckboxField";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { inputClass } from "@/pages/Login";

import FormLoading from "@/components/shared/loading/FormLoading";
import {
  useGetInvoiceInformationQuery,
  useUpdateInvoiceInformationMutation,
} from "@/store/settings/invoiceInformation/invoiceInformationAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { designGrid } from "./ProfileSettings";

const invoiceSettingsSchema = z.object({
  currency: z.string().trim().min(1, "Currency is required"),
  invoiceSeed: z.number(),
  termsAndCondition: z.string().trim(),
  paymentTerms: z.string().trim(),
  taxRate: z.number(),
  language: z.string().trim(),
});

type InvoiceSettingsFormValues = z.infer<typeof invoiceSettingsSchema>;

const InvoiceSettings = () => {
  const { data, isLoading: isFetching } = useGetInvoiceInformationQuery();
  const [updateInvoiceInformation, { isLoading: isSaving }] =
    useUpdateInvoiceInformationMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceSettingsFormValues>({
    resolver: zodResolver(invoiceSettingsSchema),
    defaultValues: {
      currency: "",
      invoiceSeed: 1,
      termsAndCondition: "",
      paymentTerms: "",
      taxRate: 8,
      language: "",
    },
  });

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (data?.data && !hasInitialized.current) {
      hasInitialized.current = true;
      const info = data.data;
      reset({
        currency: info.currency ?? "",
        invoiceSeed: info.invoiceSeed ?? 1,
        termsAndCondition: info.termsAndCondition ?? "",
        paymentTerms: info.paymentTramsAndCondition ?? "",
        taxRate: Number(info.invoiceTaxRate) || 0,
        language: info.language ?? "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: InvoiceSettingsFormValues) => {
    try {
      await updateInvoiceInformation({
        currency: values.currency,
        invoiceSeed: values.invoiceSeed,
        termsAndCondition: values.termsAndCondition,
        paymentTramsAndCondition: values.paymentTerms,
        invoiceTaxRate: values.taxRate,
        language: values.language,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update invoice information", err);
    }
  };

  return (
    <div className="">
      <CommonHeader
        size="2xl"
        className="font-medium! border-b border-border mb-6 pb-3"
      >
        Invoice Information
      </CommonHeader>
      {isFetching ? (
        <FormLoading fields={8} />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Invoice ID
            </label>
            <input
              className={inputClass.input}
              value={data?.data.iniId ?? ""}
              readOnly
            />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Currency
            </label>
            <div>
              <input className={inputClass.input} {...register("currency")} />
              {errors.currency && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Invoice Numbering
            </label>
            <CheckboxField description="Auto-generate invoice numbers sequentially" />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Invoice Seed
            </label>
            <input
              className={inputClass.input}
              {...register("invoiceSeed", { valueAsNumber: true })}
            />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right pt-2`}>
              Terms and Conditions
            </label>
            <div>
              <textarea
                className={`${inputClass.input} h-32 resize-none`}
                {...register("termsAndCondition")}
              />
              <p className="text-xs text-[#62748E] mt-1.5">
                These terms will appear at the bottom of your invoices
              </p>
            </div>
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Default Payment Terms
            </label>
            <input className={inputClass.input} {...register("paymentTerms")} />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Default Tax Rate (%)
            </label>
            <input
              className={inputClass.input}
              {...register("taxRate", { valueAsNumber: true })}
            />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Invoice Language
            </label>
            <input className={inputClass.input} {...register("language")} />
          </div>

          <div className="pt-6 mt-6 border-t border-border!">
            <CommonButton
              type="submit"
              variant="primaryGreen"
              isLoading={isSaving}
              loadingText="Saving..."
            >
              <Save />
              Save changes
            </CommonButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default InvoiceSettings;
