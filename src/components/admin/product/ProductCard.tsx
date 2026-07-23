import CommonHeader from "@/components/shared/CommonHeader";
import { Product } from "@/store/Product/types/productTypes";

interface ProductCardProps {
  product: Product;
  setSelectedProduct: (product: Product) => void;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  setSelectedProduct,
}) => {
  return (
    <div
      key={product.id}
      onClick={() => setSelectedProduct(product)}
      className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden border border-[#F1F5F9] group cursor-pointer hover:shadow-lg hover:border-[#E2E8F0] transition-all duration-300"
    >
      <div className="w-full h-64 bg-[#F8FAFC] relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product?.productName || "Product image"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {product.images && product.images.length > 1 && (
          <span className="absolute top-3 right-3 flex items-center justify-center px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-semibold">
            +{product.images.length - 1} more
          </span>
        )}

        <span className="absolute top-3 left-3 flex items-center px-2 py-0.5 rounded-full bg-white/90 text-[#314158] text-[10px] font-semibold shadow-sm">
          {product.category.name}
        </span>

        <div className="absolute bottom-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {product.colors.slice(0, 5).map((c, i) => (
            <span
              key={i}
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ background: c.code }}
            />
          ))}
          {product.colors.length > 5 && (
            <span className="w-4 h-4 rounded-full border-2 border-white shadow-sm bg-[#6B7280] flex items-center justify-center text-[8px] text-white font-bold">
              +{product.colors.length - 5}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-[#F1F5F9]">
        <CommonHeader size="sm" className="text-[#0F172B]!  font-medium! ">
          {product.productName}
        </CommonHeader>
        <CommonHeader size="xs" className=" ">
          {product.brand.name}
        </CommonHeader>

        <CommonHeader size="xs" className="text-[#94A3B8]! mt-0.5">
          Item No: {product.itemNo}
        </CommonHeader>

        {(product.material || product.style) && (
          <CommonHeader size="xs" className="text-[#94A3B8]! mt-0.5">
            {[product.material, product.style].filter(Boolean).join(" · ")}
          </CommonHeader>
        )}

        <div className="flex items-center justify-between mt-2">
          <CommonHeader size="md" className=" text-[#0F172B]!  font-semibold! ">
            ${product.price}
          </CommonHeader>
          <CommonHeader size="xs" className=" ">
            {product.colors.length} colors
          </CommonHeader>
        </div>

        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.availableSizes.map((size, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded-md border border-[#E2E8F0] text-[10px] font-medium text-[#314158]"
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
