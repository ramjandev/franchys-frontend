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
import { Link } from "react-router-dom";

const PricingMatrixSettings = () => {
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useGetPriceMatrixQuery();
  const [deletePriceMatrix, { isLoading: isDeleting, originalArgs }] =
    useDeletePriceMatrixMutation();

  const matricesData = data?.data ?? [];

  const handleDelete = async (e: React.MouseEvent, priceMatrixId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deletePriceMatrix(priceMatrixId).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <div className="mb-6 pb-4 border-b border-border flex flex-col md:flex-row justify-between items-start gap-5">
        <div>
          <CommonHeader size="2xl" className="font-medium! ">
            Pricing Matrix
          </CommonHeader>
          <CommonHeader size="sm">
            Create pricing matrices for different products and services with
            quantity-based pricing.
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matricesData.map((matrix) => (
            <Link
              key={matrix.priceMatrixId}
              to={`/admin/settings/pricing/${matrix.priceMatrixId}`}
            >
              <CardContainer size="sm" className="relative group">
                <IconActionButton
                  title="Delete matrix"
                  variant="delete"
                  className="absolute top-3 right-3"
                  isLoading={
                    isDeleting && originalArgs === matrix.priceMatrixId
                  }
                  onClick={(e) =>
                    handleDelete(
                      e as unknown as React.MouseEvent,
                      matrix.priceMatrixId,
                    )
                  }
                />
                <CommonHeader size="lg"> {matrix.name}</CommonHeader>
                <CommonHeader size="sm">{matrix.priceType}</CommonHeader>
              </CardContainer>
            </Link>
          ))}
        </div>
      )}

      {showModal && <PriceMatrixModal setShowModal={setShowModal} />}
    </div>
  );
};

export default PricingMatrixSettings;
