import ModalAction from "@/components/settings/ModalAction";
import ModalContainer from "@/components/settings/ModalContainer";
import FileUpload from "@/components/shared/FileUpload";
import {
  emptyForm,
  type NewProductForm,
  type Product,
} from "@/pages/Admin/Products";
import { inputClass } from "@/pages/Login";
import { useState } from "react";

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [form, setForm] = useState<NewProductForm>(emptyForm);

  const set = (key: keyof NewProductForm, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) =>
      setForm((f) => ({
        ...f,
        imageFile: file,
        imagePreview: e.target?.result as string,
      }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.productName || !form.itemNumber) return;
    const newProduct: Product = {
      id: form.itemNumber,
      title: form.productName,
      brand: form.brand,
      category: form.category,
      price: form.price ? `$${parseFloat(form.price).toFixed(2)}` : "$0.00",
      colors: form.colors ? `${form.colors} colors` : "0 colors",
      sizes: ["S", "M", "L", "XL"],
      material: "—",
      weight: "—",
      style: "—",
      description: "Custom product added to catalog.",
      availableColors: ["#111827"],
      imageUrl:
        form.imagePreview ||
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    };
    onAdd(newProduct);
    onClose();
  };

  return (
    <ModalContainer
      close={onClose}
      title="Add Custom Product"
      description="Manually add a product with details and an image."
      size="max-w-2xl"
    >
      <div className="p-6  space-y-5">
        <FileUpload
          onChange={(file) => file && handleFile(file)}
          fileType="image"
          label="Product Image"
          description="PNG, JPG, WEBP up to 10MB"
        />

        <div>
          {form.imagePreview && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden">
              <img
                src={form.imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, imageFile: null, imagePreview: "" }))
                }
                className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white cursor-pointer z-10"
              >
                ✕
              </button>
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
            value={form.itemNumber}
            onChange={(e) => set("itemNumber", e.target.value)}
            className={inputClass.input}
          />
        </div>
        {/* Product Name */}
        <div>
          <label className={inputClass.label}>
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Classic Cotton Hoodie"
            value={form.productName}
            onChange={(e) => set("productName", e.target.value)}
            className={inputClass.input}
          />
        </div>
        {/* Brand + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={inputClass.label}>Brand</label>
            <input
              type="text"
              placeholder="e.g. Gildan"
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              className={inputClass.input}
            />
          </div>
          <div>
            <label className={inputClass.label}>Category</label>
            <input
              type="text"
              placeholder="e.g. T-Shirts"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClass.input}
            />
          </div>
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
                placeholder="0.00"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={`${inputClass.input} pl-7`}
              />
            </div>
          </div>
          <div>
            <label className={inputClass.label}>Colors</label>
            <input
              type="text"
              placeholder="e.g. 6 colors"
              value={form.colors}
              onChange={(e) => set("colors", e.target.value)}
              className={inputClass.input}
            />
          </div>
        </div>
      </div>

      <ModalAction
        close={onClose}
        onSubmit={handleSubmit}
        create="Add to Catalog"
      />
    </ModalContainer>
  );
};

export default AddProductModal;
