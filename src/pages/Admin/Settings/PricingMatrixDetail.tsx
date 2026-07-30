import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { inputClass } from "@/pages/Login";
import {
  useCreatePriceTierMutation,
  useDeletePriceTierMutation,
  useGetPriceMatrixByIdQuery,
  useUpdatePriceMatrixMutation,
  useUpdatePriceTierMutation,
} from "@/store/settings/PriceMatrices/priceMatrixAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

// ---- schema-first types: schema is the single source of truth ----

const pricingTierSchema = z.object({
  priceTierId: z.string(),
  quantity: z.string().min(1, "Required"),
  basePrice: z.string().min(1, "Required"),
  markup: z.string().min(1, "Required"),
});

const pricingMatrixSchema = z.object({
  name: z.string().min(1, "Name is required"),
  productType: z.string().optional(),
  priceTiers: z.array(pricingTierSchema),
});

type PricingMatrixFormValues = z.infer<typeof pricingMatrixSchema>;

const PricingMatrixDetail = () => {
  const { id } = useParams();

  const { data } = useGetPriceMatrixByIdQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const [updatePriceMatrix, { isLoading: isSaving }] =
    useUpdatePriceMatrixMutation();
  const [createPriceTier, { isLoading: isAddingRow }] =
    useCreatePriceTierMutation();
  const [updatePriceTier] = useUpdatePriceTierMutation();
  const [deletePriceTier] = useDeletePriceTierMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<PricingMatrixFormValues>({
    resolver: zodResolver(pricingMatrixSchema),
    defaultValues: {
      name: "",
      productType: "",
      priceTiers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "priceTiers",
    keyName: "fieldArrayId",
  });

  // sync form with fetched data — network is the source of truth, no local state
  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data.name ?? "",
        productType: data.data.priceType ?? "",
        priceTiers: (data.data.priceTiers ?? []).map((t) => ({
          priceTierId: t.priceTierId ?? "",
          quantity: String(t.quantity),
          basePrice: String(t.basePrice),
          markup: String(t.markup),
        })),
      });
    }
  }, [data, reset]);

  // Add row: appended blank client-side only.
  // No network call fires until the row has real, valid values (see handleTierBlur).
  const addRow = () => {
    append({
      priceTierId: "",
      quantity: "115",
      basePrice: "15",
      markup: "10",
    });
  };

  const removeRow = async (index: number, priceTierId: string) => {
    if (!id || !priceTierId) {
      // never persisted to the server — just drop it locally
      remove(index);
      return;
    }
    try {
      await deletePriceTier({ priceMatrixId: id, priceTierId }).unwrap();
      remove(index);
    } catch (err) {
      console.error("Failed to delete tier", err);
    }
  };

  const handleTierBlur = async (index: number) => {
    if (!id) return;

    const tier = getValues(`priceTiers.${index}`);
    const quantity = Number(tier.quantity);
    const basePrice = Number(tier.basePrice);
    const markup = Number(tier.markup);

    if (
      !tier.quantity ||
      !tier.basePrice ||
      !tier.markup ||
      Number.isNaN(quantity) ||
      Number.isNaN(basePrice) ||
      Number.isNaN(markup)
    ) {
      return;
    }

    try {
      if (!tier.priceTierId) {
        const res = await createPriceTier({
          priceMatrixId: id,
          data: { quantity, basePrice, markup },
        }).unwrap();
        // stamp the real id onto the row so future edits PATCH instead of POST
        const updated = [...getValues("priceTiers")];
        updated[index] = {
          ...updated[index],
          priceTierId: res.data.priceTierId ?? "",
        };
        reset(
          { ...getValues(), priceTiers: updated },
          { keepErrors: true, keepDirty: true },
        );
      } else {
        await updatePriceTier({
          priceMatrixId: id,
          priceTierId: tier.priceTierId,
          data: { quantity, basePrice, markup },
        }).unwrap();
      }
    } catch (err) {
      console.error("Failed to save tier", err);
    }
  };

  const onSubmit = async (values: PricingMatrixFormValues) => {
    if (!id) return;
    try {
      await updatePriceMatrix({
        id,
        data: {
          name: values.name,
          priceTiers: values.priceTiers.map((t) => ({
            quantity: Number(t.quantity),
            basePrice: Number(t.basePrice),
            markup: Number(t.markup),
          })),
        },
      }).unwrap();
    } catch (err) {
      console.error("Failed to save price matrix", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 pb-4 border-b border-border">
        <CommonHeader size="2xl" className="font-medium!">
          Pricing Matrix
        </CommonHeader>
        <CommonHeader size="sm">
          Create pricing matrices for different products and services with
          quantity-based pricing.
        </CommonHeader>
      </div>

      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-sm text-[#155DFC] hover:underline mb-6 cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back to All Matrices
      </button>

      <div className="border border-border rounded-xl p-6 mb-6 space-y-4">
        <CommonHeader size="lg" className="font-medium! mb-2">
          General
        </CommonHeader>

        <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
          <label className={inputClass.label}>Name</label>
          <div>
            <input {...register("name")} className={inputClass.input} />
            {errors.name && (
              <p className="text-xs text-[#E7000B] mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
          <label className={inputClass.label}>Product Type</label>
          <input {...register("productType")} className={inputClass.input} />
        </div>

        <div className=" border-t border-border pt-6">
          <CommonHeader size="lg" className="font-medium! mb-4">
            Pricing Tiers
          </CommonHeader>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] ">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#314158] w-1/3">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#314158] w-1/3">
                    Base Price ($)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#314158] w-1/3">
                    Markup (%)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#314158]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.fieldArrayId}>
                    <td className="px-2 py-2">
                      <input
                        {...register(`priceTiers.${index}.quantity`)}
                        onBlur={() => handleTierBlur(index)}
                        className={`${inputClass.input} !py-2`}
                      />
                      {errors.priceTiers?.[index]?.quantity && (
                        <p className="text-xs text-[#E7000B] mt-1">
                          {errors.priceTiers[index]?.quantity?.message}
                        </p>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        {...register(`priceTiers.${index}.basePrice`)}
                        onBlur={() => handleTierBlur(index)}
                        className={`${inputClass.input} !py-2`}
                      />
                      {errors.priceTiers?.[index]?.basePrice && (
                        <p className="text-xs text-[#E7000B] mt-1">
                          {errors.priceTiers[index]?.basePrice?.message}
                        </p>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        {...register(`priceTiers.${index}.markup`)}
                        onBlur={() => handleTierBlur(index)}
                        className={`${inputClass.input} !py-2`}
                      />
                      {errors.priceTiers?.[index]?.markup && (
                        <p className="text-xs text-[#E7000B] mt-1">
                          {errors.priceTiers[index]?.markup?.message}
                        </p>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(index, field.priceTierId)}
                        className="text-[#E7000B] hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={addRow}
              disabled={isAddingRow}
              className="mx-6 mb-6 flex items-center gap-1.5 text-sm text-[#155DFC] hover:underline cursor-pointer disabled:opacity-50"
            >
              <Plus size={15} />
              Add Row
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-border">
        <CommonButton
          type="submit"
          className="bg-[#00A63E]! text-white"
          disabled={isSaving}
        >
          <Save size={15} />
          {isSaving ? "Saving..." : "Save changes"}
        </CommonButton>
      </div>
    </form>
  );
};

export default PricingMatrixDetail;
