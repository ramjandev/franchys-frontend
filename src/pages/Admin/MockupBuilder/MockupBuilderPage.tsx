import {
  DEFAULT_GARMENT_SVG,
  extractProductImages,
} from "@/lib/defaultGarment";
import {
  setCanvasProductImage,
  setProductViews,
} from "@/store/mockUp/designSlice";
import { useGetProductByIdQuery } from "@/store/Product/productAPI";
import { RootState } from "@/store/store";
import { X } from "lucide-react";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CenterCanvasArea from "./components/CenterCanvasArea";
import LeftPanel from "./components/LeftPanel";
import { ProductModal } from "./components/ProductModal";
import RightPanel from "./components/RightPanel";

export interface MockupBuilderPageProps {
  productIdOverride?: string;
  isModal?: boolean;
  onClose?: () => void;
  onSaveSuccess?: (urls: string[]) => void;
}

const MockupBuilderPage: React.FC<MockupBuilderPageProps> = ({
  productIdOverride,
  isModal = false,
  onClose,
  onSaveSuccess,
}) => {
  const navigate = useNavigate();
  const [showProductModal, setShowProductModal] = useState(false);

  const { selectedProduct } = useSelector((state: RootState) => state.image);

  const productId = selectedProduct?.productId;
  const selectedProductId =
    productIdOverride ||
    productId ||
    (selectedProduct as any)?.productId ||
    (selectedProduct as any)?.id ||
    (selectedProduct as any)?._id;

  const [activeProductId, setActiveProductId] = useState<string | undefined>(
    selectedProductId,
  );

  React.useEffect(() => {
    const idToUse =
      productIdOverride ||
      productId ||
      (selectedProduct as any)?.productId ||
      (selectedProduct as any)?.id ||
      (selectedProduct as any)?._id;

    if (idToUse) {
      setActiveProductId(idToUse);
    }
  }, [productIdOverride, productId, selectedProduct]);

  const { data } = useGetProductByIdQuery(activeProductId!, {
    skip: !activeProductId,
    refetchOnMountOrArgChange: true,
  });

  const product = data?.data || (selectedProduct as any);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const targetProduct = data?.data || (selectedProduct as any);
    if (targetProduct) {
      const extracted = extractProductImages(targetProduct);
      const imagesToUse =
        extracted.length > 0 ? extracted : [DEFAULT_GARMENT_SVG];
      dispatch(setProductViews(imagesToUse));
      dispatch(setCanvasProductImage(imagesToUse[0]));
    }
  }, [data, selectedProduct, dispatch]);

  const handleSelectProduct = (newProductId: string) => {
    setActiveProductId(newProductId);
    if (!isModal) {
      navigate(`/admin/mockups/${newProductId}`);
    }
    setShowProductModal(false);
  };

  const mainContent = (
    <div
      className={`flex flex-col ${
        isModal
          ? "w-full h-full bg-[#F8FAFC]"
          : "h-auto xl:h-full xl:overflow-hidden"
      }`}
    >
      {isModal && (
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0 shadow-2xs z-20">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base text-gray-900">
              Mockup Designer
            </span>
            {product?.productName && (
              <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2.5 py-1 rounded-md max-w-md truncate">
                {product.productName}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Close Mockup Designer"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div
        className={`flex-1 ${
          isModal
            ? "overflow-hidden p-4"
            : "overflow-y-auto xl:overflow-hidden pb-8 xl:pb-0"
        }`}
      >
        <div className="flex flex-col xl:flex-row items-stretch gap-6 h-auto xl:h-full min-h-125">
          <LeftPanel
            product={data?.data || (selectedProduct as any)}
            onOpenProductModal={() => setShowProductModal(true)}
          />
          <CenterCanvasArea
            onOpenProductModal={() => setShowProductModal(true)}
            onSelectProduct={handleSelectProduct}
          />
          <RightPanel
            isModal={isModal}
            onClose={onClose}
            onSaveSuccess={onSaveSuccess}
          />
        </div>
      </div>

      <ProductModal
        show={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );

  if (isModal) {
    return createPortal(
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 m-0 w-screen h-screen overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div
          className="w-full h-full bg-white flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {mainContent}
        </div>
      </div>,
      document.body,
    );
  }

  return mainContent;
};

export default MockupBuilderPage;
