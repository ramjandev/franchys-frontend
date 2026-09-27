import CommonSelect from "@/components/shared/CommonSelect";
import { useGetPriceMatrixQuery } from "@/store/settings/PriceMatrices/priceMatrixAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

export interface ImprintItem {
  matrixId: string;
  matrixColumn: string;
  details?: string;
}

interface PriceMatrixModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  initialImprints?: ImprintItem[];
  // Backwards-compatible props
  initialMatrixId?: string;
  initialColumn?: string;
  onSave?: (imprints: ImprintItem[]) => void;
}

/* ---------------------------------
   Validation
---------------------------------- */

const imprintSchema = z.object({
  matrix: z.string().min(1, "Matrix is required"),
  column: z.string().min(1, "Column is required"),
  details: z.string().optional(),
});

const priceMatrixSchema = z.object({
  imprints: z.array(imprintSchema),
});

type PriceMatrixFormValues = z.infer<typeof priceMatrixSchema>;

/* ---------------------------------
   Component
---------------------------------- */

const PriceMatrixModal: React.FC<PriceMatrixModalProps> = ({
  setShowModal,
  initialImprints,
  initialMatrixId,
  initialColumn,
  onSave,
}) => {
  const { data: matrixResponse } = useGetPriceMatrixQuery();
  const matrices = matrixResponse?.data ?? [];

  // Determine starting imprints
  const defaultImprints: Array<{
    matrix: string;
    column: string;
    details?: string;
  }> =
    initialImprints && initialImprints.length > 0
      ? initialImprints.map((item) => ({
          matrix: item.matrixId,
          column: item.matrixColumn,
          details: item.details || "",
        }))
      : initialMatrixId
        ? [
            {
              matrix: initialMatrixId,
              column: initialColumn || "",
              details: "",
            },
          ]
        : [
            {
              matrix: "",
              column: "",
              details: "",
            },
          ];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PriceMatrixFormValues>({
    resolver: zodResolver(priceMatrixSchema),
    mode: "onChange",
    defaultValues: {
      imprints: defaultImprints,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imprints",
  });

  const imprintsValues = watch("imprints");

  const matrixOptions = matrices.map((m) => ({
    label: m.name,
    value: m.priceMatrixId,
  }));

  const handleAddImprint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    append({
      matrix: "",
      column: "",
      details: "",
    });
  };

  const onSubmit = (values: PriceMatrixFormValues) => {
    const formatted: ImprintItem[] = values.imprints
      .filter((imp) => imp.matrix.trim() !== "")
      .map((imp) => ({
        matrixId: imp.matrix,
        matrixColumn: imp.column,
        details: imp.details,
      }));

    onSave?.(formatted);
    setShowModal(false);
  };

  const handleDone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white w-full max-w-xl max-h-[90vh] flex flex-col rounded-xl overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Manage Imprints
          </h2>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="p-6 space-y-4">
            {fields.map((field, index) => {
              const currentMatrixId = imprintsValues?.[index]?.matrix;
              const currentMatrix = matrices.find(
                (m) => m.priceMatrixId === currentMatrixId,
              );
              const cols = currentMatrix?.columns ?? [];
              const columnOptions =
                cols.length > 0
                  ? cols.map((c) => ({ label: c, value: c }))
                  : [
                      { label: "Standard / 1 Color", value: "1 Color" },
                      { label: "2 Colors", value: "2 Colors" },
                    ];

              return (
                <div
                  key={field.id}
                  className="rounded-lg bg-[#F8FAFC] border border-slate-200/90 p-5 space-y-4"
                >
                  {/* Matrix + Column */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Matrix */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-600">
                        Matrix
                      </label>
                      <Controller
                        control={control}
                        name={`imprints.${index}.matrix`}
                        render={({ field: matrixField }) => (
                          <CommonSelect
                            value={matrixField.value}
                            onValueChange={(val) => {
                              matrixField.onChange(val);
                              // Auto-select first column if available
                              const sel = matrices.find(
                                (m) => m.priceMatrixId === val,
                              );
                              if (sel?.columns && sel.columns.length > 0) {
                                setValue(
                                  `imprints.${index}.column`,
                                  sel.columns[0],
                                );
                              }
                            }}
                            item={matrixOptions}
                            placeholder={
                              matrixOptions.length === 0
                                ? "No matrices found"
                                : "Select matrix"
                            }
                            className="w-full! bg-white!"
                          />
                        )}
                      />
                      {errors.imprints?.[index]?.matrix && (
                        <p className="text-xs text-red-500">
                          {errors.imprints[index]?.matrix?.message}
                        </p>
                      )}
                    </div>

                    {/* Column */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-600">
                        Column
                      </label>
                      <Controller
                        control={control}
                        name={`imprints.${index}.column`}
                        render={({ field: colField }) => (
                          <CommonSelect
                            value={colField.value}
                            onValueChange={colField.onChange}
                            item={columnOptions}
                            placeholder="Select column"
                            className="w-full! bg-white!"
                          />
                        )}
                      />
                      {errors.imprints?.[index]?.column && (
                        <p className="text-xs text-red-500">
                          {errors.imprints[index]?.column?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Details
                    </label>
                    <Controller
                      control={control}
                      name={`imprints.${index}.details`}
                      render={({ field: detailsField }) => (
                        <textarea
                          {...detailsField}
                          rows={2}
                          placeholder=""
                          className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                        />
                      )}
                    />
                  </div>

                  {/* Actions inside Card */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {/* + Imprint Button below cards */}
            <button
              type="button"
              onClick={handleAddImprint}
              className="w-full py-2.5 px-4 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-slate-500" /> Imprint
            </button>
          </div>

          {/* Modal Footer */}
          <div className="p-4 px-6 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <button
              type="button"
              onClick={handleDone}
              className="px-5 py-2 rounded-md bg-white border border-slate-300 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition shadow-xs cursor-pointer"
            >
              Done
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PriceMatrixModal;
