import PriceMatrixModal from "@/components/settings/PriceMatrixModal";
import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import IconActionButton from "@/components/shared/IconActionButton";
import DashboardCardSkeleton from "@/components/shared/loading/DashboardCardSkeleton";
import { loadingArray } from "@/lib/utils";
import {
  useDeletePriceMatrixMutation,
  useGetPriceMatrixQuery,
} from "@/store/settings/PriceMatrices/priceMatrixAPI";
import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const PricingMatrixSettings = () => {
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useGetPriceMatrixQuery();
  const [deletePriceMatrix, { isLoading: isDeleting, originalArgs }] =
    useDeletePriceMatrixMutation();

  const matricesData = data?.data ?? [];

  const handleDelete = async (priceMatrixId: string) => {
    if (!priceMatrixId) return;
    try {
      await deletePriceMatrix(priceMatrixId).unwrap();
    } catch (err) {
      console.error(err);
    }
  };
  const navigate = useNavigate();

  return (
    <div className="">
      <div className="mb-6 pb-4 border-b border-border flex flex-col md:flex-row justify-between items-start gap-5">
        <div>
          <CommonHeader size="2xl" className="font-medium!">
            Pricing Matrix
          </CommonHeader>
          <CommonHeader size="sm">
            Create pricing matrices for different products and services with 2D columns (colors/locations) and quantity-based pricing.
          </CommonHeader>
        </div>
        <CommonButton onClick={() => setShowModal(true)}>
          <GoPlusCircle size={15} className="shrink-0" /> Create New Matrix
        </CommonButton>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingArray(8).map((_, index) => (
            <DashboardCardSkeleton key={index} />
          ))}
        </div>
      ) : matricesData.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-500 mb-3">No pricing matrices found.</p>
          <CommonButton onClick={() => setShowModal(true)}>
            <GoPlusCircle size={15} /> Create your first matrix
          </CommonButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matricesData.map((matrix) => {
            const cols = matrix.columns ?? [];
            const tierCount = matrix.priceTiers?.length ?? 0;

            return (
              <CardContainer
                key={matrix.priceMatrixId}
                size="sm"
                className="relative group hover:border-blue-400 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <IconActionButton
                      title="Edit matrix"
                      variant="edit"
                      onClick={() =>
                        navigate(`/admin/settings/pricing/${matrix.priceMatrixId}`)
                      }
                    />
                    <IconActionButton
                      title="Delete matrix"
                      variant="delete"
                      isLoading={
                        isDeleting && originalArgs === matrix.priceMatrixId
                      }
                      onClick={() => handleDelete(matrix.priceMatrixId)}
                    />
                  </div>

                  <div className="pr-16">
                    <CommonHeader size="lg" className="truncate font-semibold">
                      {matrix.name}
                    </CommonHeader>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="capitalize text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {matrix.priceType}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {tierCount} {tierCount === 1 ? "tier" : "tiers"}
                      </span>
                    </div>
                  </div>

                  {/* 2D Columns preview */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Columns ({cols.length})
                    </span>
                    {cols.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {cols.map((col) => (
                          <span
                            key={col}
                            className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium truncate max-w-[120px]"
                            title={col}
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Standard pricing (no custom columns)
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/admin/settings/pricing/${matrix.priceMatrixId}`)
                    }
                    className="hover:underline cursor-pointer flex items-center gap-1"
                  >
                    Configure tiers &amp; columns &rarr;
                  </button>
                </div>
              </CardContainer>
            );
          })}
        </div>
      )}

      {showModal && <PriceMatrixModal setShowModal={setShowModal} />}
    </div>
  );
};

export default PricingMatrixSettings;
