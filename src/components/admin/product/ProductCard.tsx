import CommonHeader from "@/components/shared/CommonHeader";
import type { Product } from "@/pages/Admin/Products";

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
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {product.availableColors.slice(0, 5).map((c, i) => (
            <span
              key={i}
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ background: c }}
            />
          ))}
          {product.availableColors.length > 5 && (
            <span className="w-4 h-4 rounded-full border-2 border-white shadow-sm bg-[#6B7280] flex items-center justify-center text-[8px] text-white font-bold">
              +{product.availableColors.length - 5}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-[#F1F5F9]">
        <CommonHeader size="sm" className="text-[#0F172B]!  font-medium! ">
          {product.title}
        </CommonHeader>
        <CommonHeader size="xs" className=" ">
          {product.brand}
        </CommonHeader>

        <div className="flex items-center justify-between mt-2">
          <CommonHeader size="md" className=" text-[#0F172B]!  font-semibold! ">
            {product.price}
          </CommonHeader>
          <CommonHeader size="xs" className=" ">
            {product.colors}
          </CommonHeader>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
