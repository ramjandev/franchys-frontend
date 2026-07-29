import ModalAction from "@/components/settings/ModalAction";
import ModalContainer from "@/components/settings/ModalContainer";
import { inputClass } from "@/pages/Login";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "@/store/brandCategory/brandCategoryApi";
import { Brand } from "@/store/brandCategory/types/brandCategoryTypes";

import { useState } from "react";
import { z } from "zod";

interface AddBrandModalProps {
  close: () => void;
  selectedBrand?: Brand;
}

const brandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Brand name is required")
    .max(100, "Brand name must be under 100 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description must be under 500 characters"),
});

type BrandFormErrors = Partial<
  Record<keyof z.infer<typeof brandSchema>, string>
>;

const AddBrandModal: React.FC<AddBrandModalProps> = ({
  close,
  selectedBrand,
}) => {
  const isEditMode = Boolean(selectedBrand);

  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

  const [name, setName] = useState(selectedBrand?.name ?? "");
  const [description, setDescription] = useState(
    selectedBrand?.description ?? "",
  );
  const [errors, setErrors] = useState<BrandFormErrors>({});
  const [submitError, setSubmitError] = useState("");

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async () => {
    setSubmitError("");

    const result = brandSchema.safeParse({ name, description });

    if (!result.success) {
      const fieldErrors: BrandFormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof BrandFormErrors;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      if (isEditMode && selectedBrand) {
        await updateBrand({ id: selectedBrand.id, data: result.data }).unwrap();
      } else {
        await createBrand(result.data).unwrap();
      }
      close();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <ModalContainer
      close={() => close()}
      title={isEditMode ? "Edit Brand" : "Add New Brand"}
    >
      <form className="p-6 space-y-4">
        <div>
          <label className={inputClass.label}>Brand Name</label>
          <input
            type="text"
            placeholder="e.g., Nike, Adidas"
            className={inputClass.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className={inputClass.label}>Description</label>
          <input
            type="text"
            placeholder="e.g., Just Do It"
            className={inputClass.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>
        {submitError && <p className="text-xs text-red-500">{submitError}</p>}{" "}
        <ModalAction
          close={() => close()}
          create={isEditMode ? "Save Changes" : "Add Brand"}
          isSubmitting={isSubmitting}
          loadingText="Saving..."
          onSubmit={() => handleSubmit()}
        />
      </form>
    </ModalContainer>
  );
};

export default AddBrandModal;
