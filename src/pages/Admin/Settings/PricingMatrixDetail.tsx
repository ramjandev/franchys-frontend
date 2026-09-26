import TierModal, { TierData } from "@/components/settings/TierModal";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import IconActionButton from "@/components/shared/IconActionButton";
import { inputClass } from "@/pages/Login";
import {
  useDeletePriceTierMutation,
  useGetPriceMatrixByIdQuery,
  useUpdatePriceMatrixMutation,
} from "@/store/settings/PriceMatrices/priceMatrixAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const pricingMatrixSchema = z.object({
  name: z.string().min(1, "Name is required"),
  productType: z.string().optional(),
  columns: z.array(z.string()),
});

type PricingMatrixFormValues = z.infer<typeof pricingMatrixSchema>;

const QUICK_PRESETS = [
  "1 Color",
  "2 Colors",
  "3 Colors",
  "4 Colors",
  "5 Colors",
  "6 Colors",
];

const PricingMatrixDetail = () => {
  const { id } = useParams();

  const { data } = useGetPriceMatrixByIdQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const [updatePriceMatrix, { isLoading: isSaving }] =
    useUpdatePriceMatrixMutation();
  const [deletePriceTier, { isLoading: isDeletingTier, originalArgs }] =
    useDeletePriceTierMutation();

  const [newColumnName, setNewColumnName] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Tier modal state
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<TierData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PricingMatrixFormValues>({
    resolver: zodResolver(pricingMatrixSchema),
    defaultValues: {
      name: "",
      productType: "",
      columns: [],
    },
  });

  const activeColumns = watch("columns") ?? [];
  const tiers = data?.data?.priceTiers ?? [];

  // Sync form with fetched matrix data
  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data.name ?? "",
        productType: data.data.priceType ?? "",
        columns: data.data.columns ?? [],
      });
    }
  }, [data, reset]);

  const handleAddColumn = (colName?: string) => {
    const trimmed = (colName ?? newColumnName).trim();
    if (!trimmed) return;
    if (activeColumns.includes(trimmed)) return;

    const nextCols = [...activeColumns, trimmed];
    setValue("columns", nextCols, { shouldDirty: true });
    setNewColumnName("");
  };

  const handleRemoveColumn = (colToRemove: string) => {
    const nextCols = activeColumns.filter((c) => c !== colToRemove);
    setValue("columns", nextCols, { shouldDirty: true });
  };

  // Open modal to add tier (NO network call on click!)
  const handleOpenAddTier = () => {
    setEditingTier(null);
    setIsTierModalOpen(true);
  };

  // Open modal to edit existing tier
  const handleOpenEditTier = (tier: TierData) => {
    setEditingTier(tier);
    setIsTierModalOpen(true);
  };

  const handleDeleteTier = async (priceTierId?: string) => {
    if (!id || !priceTierId) return;
    try {
      await deletePriceTier({ priceMatrixId: id, priceTierId }).unwrap();
    } catch (err) {
      console.error("Failed to delete price tier", err);
    }
  };

  const onSubmit = async (values: PricingMatrixFormValues) => {
    if (!id) return;
    try {
      setSaveSuccessMsg("");
      await updatePriceMatrix({
        id,
        data: {
          name: values.name,
          columns: values.columns,
        },
      }).unwrap();

      setSaveSuccessMsg("Matrix general settings saved!");
      setTimeout(() => setSaveSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Failed to save price matrix", err);
    }
  };

  return (
    <div className="pb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 pb-4 border-b border-border">
          <CommonHeader size="2xl" className="font-medium!">
            Pricing Matrix Detail
          </CommonHeader>
          <CommonHeader size="sm">
            Configure dimensions, columns, and quantity tiers with live volume pooling support.
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

        <div className="border border-border rounded-xl p-6 mb-6 space-y-5 bg-white shadow-xs">
          <CommonHeader size="lg" className="font-medium! mb-2">
            General Information
          </CommonHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={inputClass.label}>Matrix Name</label>
              <input {...register("name")} className={inputClass.input} />
              {errors.name && (
                <p className="text-xs text-[#E7000B] mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className={inputClass.label}>Price Type</label>
              <input
                {...register("productType")}
                readOnly
                className={`${inputClass.input} bg-slate-50 cursor-not-allowed text-slate-600`}
              />
            </div>
          </div>

          {/* 2D Columns Section */}
          <div className="space-y-3 p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-800">
                  Matrix Columns (Dimensions / Locations / Colors)
                </span>
                <p className="text-[11px] text-slate-500">
                  Define columns like &quot;1 Color&quot;, &quot;2 Colors&quot;. In quotes, line items can pick one of these matrix columns.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddColumn();
                    }
                  }}
                  placeholder="e.g., 3 Colors"
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500 w-36"
                />
                <button
                  type="button"
                  onClick={() => handleAddColumn()}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
                >
                  <Plus size={13} /> Add
                </button>
              </div>
            </div>

            {/* Active column badges & presets */}
            <div className="flex items-center flex-wrap gap-2 pt-1">
              {activeColumns.length > 0 ? (
                activeColumns.map((col) => (
                  <span
                    key={col}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium"
                  >
                    {col}
                    <button
                      type="button"
                      onClick={() => handleRemoveColumn(col)}
                      className="hover:text-red-600 transition cursor-pointer"
                      title={`Remove ${col}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">
                  No custom columns added yet. Standard base pricing is active.
                </span>
              )}

              <div className="flex items-center gap-1 ml-auto text-[11px] text-slate-400">
                <span>Quick add:</span>
                {QUICK_PRESETS.filter((p) => !activeColumns.includes(p))
                  .slice(0, 3)
                  .map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddColumn(preset)}
                      className="hover:text-blue-600 hover:underline cursor-pointer"
                    >
                      +{preset}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Pricing Tiers Section */}
          <div className="border-t border-border pt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CommonHeader size="lg" className="font-medium!">
                  Pricing Tiers
                </CommonHeader>
                <p className="text-[11px] text-slate-500">
                  Manage quantity breaks and rates. Click &quot;Add Row&quot; to open the tier modal.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddTier}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                <Plus size={14} /> Add Row
              </button>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-border text-[#314158] font-semibold">
                    <th className="px-3 py-2.5 w-24">Quantity</th>
                    <th className="px-3 py-2.5 w-28">Base Price ($)</th>
                    <th className="px-3 py-2.5 w-24">Markup (%)</th>
                    {activeColumns.map((col) => (
                      <th key={col} className="px-3 py-2.5 min-w-[110px]">
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate">{col} ($)</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColumn(col)}
                            className="text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title={`Remove ${col} column`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-2.5 w-24 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tiers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4 + activeColumns.length}
                        className="py-8 text-center text-slate-400"
                      >
                        No pricing tiers configured yet. Click &quot;Add Row&quot; below to add one.
                      </td>
                    </tr>
                  ) : (
                    tiers.map((tier) => (
                      <tr
                        key={tier.priceTierId}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="px-3 py-2.5 font-medium text-slate-800">
                          {tier.quantity}+
                        </td>
                        <td className="px-3 py-2.5 text-slate-700">
                          ${Number(tier.basePrice ?? 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-slate-700">
                          {tier.markup}%
                        </td>
                        {activeColumns.map((col) => {
                          const colPrice = tier.columnPrices?.[col];
                          return (
                            <td
                              key={col}
                              className="px-3 py-2.5 font-medium text-blue-600"
                            >
                              {colPrice !== undefined && colPrice !== null && colPrice !== ""
                                ? `$${Number(colPrice).toFixed(2)}`
                                : "-"}
                            </td>
                          );
                        })}
                        <td className="px-3 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <IconActionButton
                              variant="edit"
                              title="Edit Tier"
                              onClick={() => handleOpenEditTier(tier)}
                            />
                            <IconActionButton
                              variant="delete"
                              title="Delete Tier"
                              isLoading={
                                isDeletingTier &&
                                originalArgs?.priceTierId === tier.priceTierId
                              }
                              onClick={() => handleDeleteTier(tier.priceTierId)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="p-3 bg-slate-50/60 border-t border-border">
                <button
                  type="button"
                  onClick={handleOpenAddTier}
                  className="flex items-center gap-1.5 text-xs text-[#155DFC] hover:underline cursor-pointer font-semibold"
                >
                  <Plus size={14} />
                  Add Row
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <CommonButton
            type="submit"
            className="bg-[#00A63E]! text-white"
            disabled={isSaving}
          >
            <Save size={15} />
            {isSaving ? "Saving..." : "Save changes"}
          </CommonButton>
          {saveSuccessMsg && (
            <span className="text-xs font-semibold text-emerald-600">
              {saveSuccessMsg}
            </span>
          )}
        </div>
      </form>

      {/* Dedicated Tier Modal */}
      {id && (
        <TierModal
          isOpen={isTierModalOpen}
          onClose={() => {
            setIsTierModalOpen(false);
            setEditingTier(null);
          }}
          priceMatrixId={id}
          columns={activeColumns}
          editingTier={editingTier}
        />
      )}
    </div>
  );
};

export default PricingMatrixDetail;
