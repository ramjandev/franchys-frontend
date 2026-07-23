import ModalContainer from "@/components/settings/ModalContainer";
import { inputClass } from "@/pages/Login";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/store/settings/brandCategory/brandCategoryApi";

import ModalAction from "@/components/settings/ModalAction";
import { Category } from "@/store/settings/brandCategory/types/brandCategoryTypes";
import { useState } from "react";
import { z } from "zod";

interface AddCategoryModalProps {
  close: () => void;
  selectedCategory?: Category;
}

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name must be under 100 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description must be under 500 characters"),
});

type CategoryFormErrors = Partial<
  Record<keyof z.infer<typeof categorySchema>, string>
>;

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  close,
  selectedCategory,
}) => {
  const isEditMode = Boolean(selectedCategory);

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [name, setName] = useState(selectedCategory?.name ?? "");
  const [description, setDescription] = useState(
    selectedCategory?.description ?? "",
  );
  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [submitError, setSubmitError] = useState("");

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async () => {
    setSubmitError("");

    const result = categorySchema.safeParse({ name, description });

    if (!result.success) {
      const fieldErrors: CategoryFormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof CategoryFormErrors;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      if (isEditMode && selectedCategory) {
        await updateCategory({
          id: selectedCategory.id,
          data: result.data,
        }).unwrap();
      } else {
        await createCategory(result.data).unwrap();
      }
      close();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <ModalContainer
      close={() => close()}
      title={isEditMode ? "Edit Category" : "Add New Category"}
    >
      <form className="p-6 space-y-4">
        <div>
          <label className={inputClass.label}>Category Name</label>
          <input
            type="text"
            placeholder="e.g., Apparel, Footwear"
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
            placeholder="e.g., Clothing and wearables"
            className={inputClass.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>
        {submitError && <p className="text-xs text-red-500">{submitError}</p>}
      </form>

      <ModalAction
        close={() => close()}
        create={isEditMode ? "Save Changes" : "Add Category"}
        isSubmitting={isSubmitting}
        loadingText="Saving..."
        onSubmit={() => handleSubmit()}
      />
    </ModalContainer>
  );
};

export default AddCategoryModal;
