import ModalAction from "@/components/settings/ModalAction";
import ModalContainer from "@/components/settings/ModalContainer";
import CommonSelect, { SelectOption } from "@/components/shared/CommonSelect";
import FileUpload from "@/components/shared/FileUpload";

import CommonButton from "@/components/shared/CommonButton";
import { inputClass } from "@/pages/Login";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/store/Product/productAPI";
import { Product } from "@/store/Product/types/productTypes";
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
} from "@/store/brandCategory/brandCategoryApi";
import { useGetSelectedSizesQuery } from "@/store/settings/customLineItems/lineItemCustomizationAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { findNearestColorName } from "./colorNameMap";

interface AddProductModalProps {
  onClose: () => void;
  onSaved?: () => void;
  product?: Product;
}

const OTHER_VALUE = "other";

const productSchema = z
  .object({
    itemNo: z.string().trim().min(1, "Item number is required"),
    productName: z.string().trim().min(1, "Product name is required"),
    price: z.number().min(0, "Price must be 0 or greater"),
    colors: z.array(
      z.object({
        name: z.string().trim().min(1, "Color name is required"),
        code: z.string().trim().min(1, "Color code is required"),
      }),
    ),
    categoryId: z.string().trim(),
    categoryName: z.string().trim(),
    brandId: z.string().trim(),
    brandName: z.string().trim(),
    description: z.string().trim(),
    material: z.string().trim(),
    weight: z.union([z.number().min(0, "Weight must be 0 or greater"), z.nan()]).optional(),
    style: z.string().trim(),
    availableSizes: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    if (values.categoryId === OTHER_VALUE && !values.categoryName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom category name is required",
        path: ["categoryName"],
      });
    }
    if (values.brandId === OTHER_VALUE && !values.brandName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom brand name is required",
        path: ["brandName"],
      });
    }
  });

type ProductFormValues = z.infer<typeof productSchema>;

const AddProductModal: React.FC<AddProductModalProps> = ({
  onClose,
  onSaved,
  product,
}) => {
  const isEditMode = Boolean(product);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isSubmitting = isCreating || isUpdating;

  const [images, setImages] = useState<{ file?: File; preview: string }[]>(
    product?.images.map((url) => ({ preview: url })) ?? [],
  );

  const { data: categoryData } = useGetCategoriesQuery({ page: 1, limit: 100 });
  const { data: brandData } = useGetBrandsQuery({ page: 1, limit: 100 });

  const [submitError, setSubmitError] = useState("");

  const categoryOptions: SelectOption<string>[] = [
    ...(categoryData?.data ?? []).map((c) => ({ label: c.name, value: c.id })),
    { label: "Other (custom)", value: OTHER_VALUE },
  ];

  const brandOptions: SelectOption<string>[] = [
    ...(brandData?.data ?? []).map((b) => ({ label: b.name, value: b.id })),
    { label: "Other (custom)", value: OTHER_VALUE },
  ];

  // size
  const { data } = useGetSelectedSizesQuery();
  const availableSizes = data?.data?.map((s) => s) ?? [];

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      itemNo: product?.itemNo ?? "",
      productName: product?.productName ?? "",
      price: product ? Number(product.price) : 0,
      colors: product?.colors ?? [],
      categoryId: product?.categoryId ?? "",
      categoryName: "",
      brandId: product?.brandId ?? "",
      brandName: "",
      description: "",
      material: product?.material ?? "",
      weight: product?.weight ? Number(product.weight) : undefined,
      style: product?.style ?? "",
      availableSizes: product?.availableSizes ?? [],
    },
  });

  const categoryId = watch("categoryId");
  const brandId = watch("brandId");
  const selectedSizes = watch("availableSizes");

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [
          ...prev,
          { file, preview: e.target?.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({ control, name: "colors" });

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitError("");

    const formData = new FormData();
    formData.append("productName", values.productName);
    formData.append("itemNo", values.itemNo);
    formData.append("price", String(values.price));

    if (values.categoryId && values.categoryId !== OTHER_VALUE) {
      formData.append("categoryId", values.categoryId);
    }
    if (values.categoryId === OTHER_VALUE && values.categoryName) {
      formData.append("categoryName", values.categoryName);
    }

    if (values.brandId && values.brandId !== OTHER_VALUE) {
      formData.append("brandId", values.brandId);
    }
    if (values.brandId === OTHER_VALUE && values.brandName) {
      formData.append("brandName", values.brandName);
    }

    if (values.description) formData.append("description", values.description);
    if (values.material) formData.append("material", values.material);
    if (
      values.weight !== undefined &&
      values.weight !== null &&
      !Number.isNaN(values.weight)
    ) {
      formData.append("weight", String(values.weight));
    }
    if (values.style) formData.append("style", values.style);
    if (values.availableSizes && values.availableSizes.length > 0) {
      formData.append("availableSizes", JSON.stringify(values.availableSizes));
    }
    if (values.colors && values.colors.length > 0) {
      formData.append("colors", JSON.stringify(values.colors));
    }
    images.forEach(({ file }) => {
      if (file) formData.append("images", file);
    });

    try {
      if (isEditMode && product) {
        await updateProduct({ id: product.id, data: formData }).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }
      onSaved?.();
      onClose();
    } catch (err) {
      console.error("Failed to save product", err);
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  const toggleSize = (size: string, onChange: (val: string[]) => void) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    onChange(next);
  };

  return (
    <ModalContainer
      close={onClose}
      title={isEditMode ? "Edit Product" : "Add Custom Product"}
      description={
        isEditMode
          ? "Update this product's details and image."
          : "Manually add a product with details and an image."
      }
      size="max-w-3xl"
    >
      <form>
        <div className="p-6 space-y-5">
          {/* Product Image */}
          <div>
            <label className={inputClass.label}>Product Images</label>
            <FileUpload
              fileType="image"
              label=""
              description="PNG, JPG, WEBP — up to 10 MB each"
              multiple
              onFilesChange={handleFiles}
            />
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200"
                  >
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white cursor-pointer z-10"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Item Number */}
          <div>
            <label className={inputClass.label}>
              Item Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. SKU-12345"
              className={inputClass.input}
              {...register("itemNo")}
            />
            {errors.itemNo && (
              <p className="text-xs text-red-500 mt-1">
                {errors.itemNo.message}
              </p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className={inputClass.label}>
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Classic Cotton Hoodie"
              className={inputClass.input}
              {...register("productName")}
            />
            {errors.productName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Price + Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={inputClass.label}>Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#A0B0C0] font-medium">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`${inputClass.input} pl-7`}
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            {/* Colors */}
            <div>
              <div className="flex items-center justify-between">
                <label className={inputClass.label}>Colors</label>
                <span className="text-[11px] text-[#62748E] font-normal">
                  (Optional)
                </span>
              </div>

              <div className="space-y-2 mt-2">
                {colorFields.length === 0 && (
                  <p className="text-xs text-[#62748E] italic py-1">
                    No colors added (optional for non-apparel)
                  </p>
                )}
                {colorFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <label className="relative w-10 h-10 rounded-lg border border-slate-200 cursor-pointer shrink-0 overflow-hidden">
                      <input
                        type="color"
                        defaultValue={field.code}
                        onChange={(e) => {
                          const code = e.target.value;
                          setValue(`colors.${index}.code`, code);

                          const currentName = getValues(`colors.${index}.name`);
                          if (!currentName) {
                            setValue(
                              `colors.${index}.name`,
                              findNearestColorName(code),
                            );
                          }
                        }}
                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                      />
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: watch(`colors.${index}.code`),
                        }}
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Color name"
                      className={`${inputClass.input} flex-1`}
                      {...register(`colors.${index}.name` as const)}
                    />

                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="p-2 text-[#E7000B] hover:bg-red-50 rounded-lg cursor-pointer transition-colors shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {errors.colors && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.colors.message ?? errors.colors.root?.message}
                </p>
              )}

              <CommonButton
                size="sm"
                variant="ghost"
                type="button"
                onClick={() =>
                  appendColor({
                    name: findNearestColorName("#000000"),
                    code: "#000000",
                  })
                }
                className="px-2! py-1! mt-2! text-[10px]!"
              >
                + Add Color
              </CommonButton>
            </div>
          </div>

          {/* Category + Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={inputClass.label}>Category</label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <CommonSelect
                    item={categoryOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="All"
                    className="w-full!"
                  />
                )}
              />
              {categoryId === OTHER_VALUE && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter custom category name"
                    className={inputClass.input}
                    {...register("categoryName")}
                  />
                  {errors.categoryName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.categoryName.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className={inputClass.label}>Brand</label>
              <Controller
                control={control}
                name="brandId"
                render={({ field }) => (
                  <CommonSelect
                    item={brandOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="All"
                    className="w-full!"
                  />
                )}
              />
              {brandId === OTHER_VALUE && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter custom brand name"
                    className={inputClass.input}
                    {...register("brandName")}
                  />
                  {errors.brandName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.brandName.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={inputClass.label}>Description</label>
            <textarea
              placeholder="e.g. Lightweight athletic jacket with full zip."
              rows={3}
              className={`${inputClass.input} resize-none`}
              {...register("description")}
            />
          </div>

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between">
              <label className={inputClass.label}>Specifications</label>
              <span className="text-[11px] text-[#62748E] font-normal">
                (Optional)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div>
                <p className="text-[10px] font-semibold text-[#62748E] uppercase tracking-wider mb-1">
                  Material
                </p>
                <input
                  type="text"
                  placeholder="e.g. Polyester / Ceramic"
                  className={inputClass.input}
                  {...register("material")}
                />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#62748E] uppercase tracking-wider mb-1">
                  Weight (lbs)
                </p>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 0.6"
                  className={inputClass.input}
                  {...register("weight", { valueAsNumber: true })}
                />
                {errors.weight && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.weight.message}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#62748E] uppercase tracking-wider mb-1">
                  Style
                </p>
                <input
                  type="text"
                  placeholder="e.g. Athletic / Mug / Pen"
                  className={inputClass.input}
                  {...register("style")}
                />
              </div>
            </div>
          </div>

          {/* Available Sizes */}
          <div>
            <div className="flex items-center justify-between">
              <label className={inputClass.label}>Available Sizes</label>
              <span className="text-[11px] text-[#62748E] font-normal">
                (Optional for non-apparel)
              </span>
            </div>
            <Controller
              control={control}
              name="availableSizes"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size, field.onChange)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                        (field.value || []).includes(size)
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {submitError && <p className="text-xs text-red-500">{submitError}</p>}
        </div>
      </form>
      <ModalAction
        close={onClose}
        create={isEditMode ? "Save Changes" : "Add to Catalog"}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        loadingText={isEditMode ? "Saving..." : "Adding..."}
      />
    </ModalContainer>
  );
};

export default AddProductModal;
