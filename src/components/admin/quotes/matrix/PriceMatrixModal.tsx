import { inputClass } from "@/pages/Login";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import ModalAction from "@/components/settings/ModalAction";
import ModalContainer from "@/components/settings/ModalContainer";
import CommonSelect from "@/components/shared/CommonSelect";
import IconActionButton from "@/components/shared/IconActionButton";

interface PriceMatrixModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
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
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PriceMatrixFormValues>({
    resolver: zodResolver(priceMatrixSchema),
    mode: "onChange",
    defaultValues: {
      imprints: [
        {
          matrix: "",
          column: "",
          details: "",
        },
      ],
    },
  });

  /* ---------------------------------
     Field Array
  ---------------------------------- */

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imprints",
  });

  /* ---------------------------------
     Options
  ---------------------------------- */

  const matrixOptions = [
    {
      label: "Apparel_Screen Print",
      value: "apparel_screen_print",
    },
    {
      label: "Apparel_Embroidery",
      value: "apparel_embroidery",
    },
    {
      label: "Digital Print",
      value: "digital_print",
    },
  ];

  const columnOptions = [
    {
      label: "1 color",
      value: "1",
    },
    {
      label: "2 colors",
      value: "2",
    },
    {
      label: "3 colors",
      value: "3",
    },
    {
      label: "4 colors",
      value: "4",
    },
  ];

  /* ---------------------------------
     Add Imprint
  ---------------------------------- */

  const handleAddImprint = () => {
    append({
      matrix: "",
      column: "",
      details: "",
    });
  };

  /* ---------------------------------
     Submit
  ---------------------------------- */

  const onSubmit = async (values: PriceMatrixFormValues) => {
    try {
      console.log("Price Matrix:", values);

      /*
        Example result:

        {
          imprints: [
            {
              matrix: "apparel_screen_print",
              column: "1",
              details: "Front print"
            },
            {
              matrix: "apparel_embroidery",
              column: "2",
              details: "Left chest"
            }
          ]
        }
      */

      // API call here
      // await createPriceMatrix(values).unwrap();

      setShowModal(false);
    } catch (error) {
      console.error("Failed to create price matrix", error);
    }
  };

  return (
    <ModalContainer close={() => setShowModal(false)} title="Manage Imprints">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-5">
          {/* ---------------------------------
              Imprints
          ---------------------------------- */}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-md bg-[#F1F5F9] p-5 space-y-5"
            >
              {/* Matrix + Column */}

              <div className="grid grid-cols-2 gap-5">
                {/* Matrix */}

                <div className="space-y-2">
                  <label className={inputClass.label}>Matrix</label>

                  <Controller
                    control={control}
                    name={`imprints.${index}.matrix`}
                    render={({ field }) => (
                      <CommonSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        item={matrixOptions}
                        placeholder="Select matrix"
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

                <div className="space-y-2">
                  <label className={inputClass.label}>Column</label>

                  <Controller
                    control={control}
                    name={`imprints.${index}.column`}
                    render={({ field }) => (
                      <CommonSelect
                        value={field.value}
                        onValueChange={field.onChange}
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

              <div className="space-y-2">
                <label className={inputClass.label}>Details</label>

                <Controller
                  control={control}
                  name={`imprints.${index}.details`}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
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

              <div className="flex items-center gap-2">
                {/* Add */}

                <IconActionButton
                  onClick={handleAddImprint}
                  variant="add"
                  title="Add Imprint"
                />

                {/* Delete */}

                <IconActionButton
                  onClick={() => remove(index)}
                  variant="delete"
                  title="Delete Imprint"
                  // isLoading={fields.length === 1}
                />
              </div>
            </div>
          ))}

          {/* ---------------------------------
              Modal Footer
          ---------------------------------- */}

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
