import { inputClass } from "@/pages/Login";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import ModalAction from "@/components/settings/ModalAction";
import ModalContainer from "@/components/settings/ModalContainer";
import CommonSelect from "@/components/shared/CommonSelect";
import IconActionButton from "@/components/shared/IconActionButton";
import { useGetPriceMatrixQuery } from "@/store/settings/PriceMatrices/priceMatrixAPI";

interface PriceMatrixModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  initialMatrixId?: string;
  initialColumn?: string;
  onSave?: (matrixId: string, column: string, details?: string) => void;
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
  imprints: z.array(imprintSchema).min(1, "At least one imprint is required"),
});

type PriceMatrixFormValues = z.infer<typeof priceMatrixSchema>;

/* ---------------------------------
   Component
---------------------------------- */

const PriceMatrixModal: React.FC<PriceMatrixModalProps> = ({
  setShowModal,
  initialMatrixId,
  initialColumn,
  onSave,
}) => {
  const { data: matrixResponse } = useGetPriceMatrixQuery();
  const matrices = matrixResponse?.data ?? [];

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
      imprints: [
        {
          matrix: initialMatrixId || "",
          column: initialColumn || "",
          details: "",
        },
      ],
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

  const handleAddImprint = () => {
    append({
      matrix: "",
      column: "",
      details: "",
    });
  };

  const onSubmit = async (values: PriceMatrixFormValues) => {
    try {
      const firstImprint = values.imprints[0];
      if (firstImprint) {
        onSave?.(firstImprint.matrix, firstImprint.column, firstImprint.details);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save price matrix imprint", error);
    }
  };

  return (
    <ModalContainer
      close={() => setShowModal(false)}
      title="Manage Imprints & Pricing Matrix"
      description="Select price matrices and columns for each imprint location."
      size="max-w-4xl"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-5">
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
                className="rounded-md bg-[#F1F5F9] p-5 space-y-4"
              >
                {/* Matrix + Column */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Matrix */}
                  <div className="space-y-1.5">
                    <label className={inputClass.label}>Pricing Matrix</label>
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
                          className="w-full!"
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
                    <label className={inputClass.label}>Matrix Column</label>
                    <Controller
                      control={control}
                      name={`imprints.${index}.column`}
                      render={({ field: colField }) => (
                        <CommonSelect
                          value={colField.value}
                          onValueChange={colField.onChange}
                          item={columnOptions}
                          placeholder="Select column"
                          className="w-full!"
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
                  <label className={inputClass.label}>
                    Details (e.g., location, notes)
                  </label>
                  <Controller
                    control={control}
                    name={`imprints.${index}.details`}
                    render={({ field: detailsField }) => (
                      <textarea
                        {...detailsField}
                        rows={2}
                        placeholder="e.g., Front Chest, 2 Colors"
                        className="w-full resize-none rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm outline-none focus:border-[#94A3B8] focus:ring-0"
                      />
                    )}
                  />
                  {errors.imprints?.[index]?.details && (
                    <p className="text-xs text-red-500">
                      {errors.imprints[index]?.details?.message}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <IconActionButton
                    onClick={handleAddImprint}
                    variant="add"
                    title="Add Imprint"
                  />
                  {fields.length > 1 && (
                    <IconActionButton
                      onClick={() => remove(index)}
                      variant="delete"
                      title="Delete Imprint"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Modal Footer */}
          <ModalAction
            close={() => setShowModal(false)}
            create="Save"
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={false}
            loadingText="Saving..."
          />
        </div>
      </form>
    </ModalContainer>
  );
};

export default PriceMatrixModal;
