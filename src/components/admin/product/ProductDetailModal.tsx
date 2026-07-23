import ModalContainer from "@/components/settings/ModalContainer";
import CommonHeader from "@/components/shared/CommonHeader";

import DeleteAlert from "@/components/shared/DeleteButton";
import EditButton from "@/components/shared/IconActionButton";
import { useDeleteProductMutation } from "@/store/Product/productAPI";
import { Product } from "@/store/Product/types/productTypes";
import { useState } from "react";
import ProductColorManager from "./ProductColorManager";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEdit,
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [deleteProduct] = useDeleteProductMutation();

  const images = product.images?.length > 0 ? product.images : [];

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  return (
    <ModalContainer close={onClose} title="Product Details" size="max-w-3xl">
      <div className="p-6 flex flex-col sm:flex-row gap-5">
        {/* Image gallery */}
        <div className="w-full sm:w-1/2 shrink-0">
          <div className="w-full h-59 rounded-xl overflow-hidden bg-[#F8FAFC]">
            {images.length > 0 ? (
              <img
                src={images[activeImage]}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors ${
                    activeImage === i ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.productName} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4  ">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CommonHeader size="xl">{product.productName}</CommonHeader>
              <CommonHeader size="2xl" className="font-normal!">
                ${product.price}
              </CommonHeader>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <EditButton title="Edit" onClick={onEdit} />
              <DeleteAlert action={handleDelete} />
            </div>
          </div>

          <div className="space-y-1">
            <CommonHeader size="xs" className="text-[#62748E]! font-medium!">
              DESCRIPTION
            </CommonHeader>
            <CommonHeader size="sm">
              {product.itemNo} &bull; {product.brand.name} &bull;{" "}
              {product.category.name}
            </CommonHeader>
          </div>

          <div className="space-y-1">
            <CommonHeader size="xs" className="text-[#62748E]! font-medium!">
              Specifications
            </CommonHeader>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Material", value: product.material },
                { label: "Weight", value: product.weight },
                { label: "Style", value: product.style },
              ].map(({ label, value }) => (
                <div key={label}>
                  <CommonHeader size="xs" className="text-[#62748E]! ">
                    {label}
                  </CommonHeader>
                  <CommonHeader size="sm" className="text-[#0F172B]!">
                    {value}
                  </CommonHeader>
                </div>
              ))}
            </div>
          </div>

          <ProductColorManager productId={product.id} />

          <div className="space-y-1">
            <CommonHeader size="xs" className="text-[#62748E]! font-medium!">
              AVAILABLE SIZES
            </CommonHeader>
            <div className="flex items-center gap-2 flex-wrap">
              {product.availableSizes.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-[#0F172B] bg-white hover:bg-[#F8FAFC] transition-colors"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ProductDetailModal;
