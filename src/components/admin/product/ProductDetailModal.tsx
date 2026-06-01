import ModalContainer from "@/components/settings/ModalContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import type { Product } from "@/pages/Admin/Products";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  return (
    <ModalContainer close={onClose} title="Product Details" size="max-w-2xl">
      <div className="p-6  flex flex-col sm:flex-row gap-5">
        <div className="w-full sm:w-59 h-59 rounded-xl overflow-hidden shrink-0">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <CommonHeader size="xl">{product.title}</CommonHeader>
            <CommonHeader size="2xl" className="font-normal!">
              {product.price}
            </CommonHeader>
          </div>

          <div className="space-y-1">
            <CommonHeader size="xs" className="text-[#62748E]! font-medium!">
              DESCRIPTION
            </CommonHeader>
            <CommonHeader size="sm">{product.description}</CommonHeader>
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
          <div className="space-y-1">
            <CommonHeader size="xs" className="text-[#62748E]! font-medium!">
              AVAILABLE COLORS ({product.availableColors.length})
            </CommonHeader>
            <div className="flex items-center gap-2 flex-wrap">
              {product.availableColors.map((color, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white shadow ring-1 ring-[#E6EBF2]"
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <CommonHeader size="xs" className="text-[#62748E]! font-medium!">
              AVAILABLE SIZES
            </CommonHeader>
            <div className="flex items-center gap-2 flex-wrap">
              {product.sizes.map((size) => (
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
