import PriceMatrixModal from "@/components/settings/PriceMatrixModal";
import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { Link } from "react-router-dom";

const matricesData = [
  { id: 1, name: "T-Shirt Pricing", type: "Apparel" },
  { id: 2, name: "Embroidery Pricing", type: "Decoration" },
  { id: 3, name: "Screen Printing", type: "Decoration" },
  { id: 4, name: "Banners & Signs", type: "Signage" },
];

const PricingMatrixSettings = () => {
  const [showModal, setShowModal] = useState(false);

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
        <CommonButton onClick={() => setShowModal(true)} variant="gradient">
          <GoPlusCircle size={15} className="shrink-0" /> Create New Matrix
        </CommonButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matricesData.map((matrix) => (
          <Link key={matrix.id} to={`/admin/settings/pricing/${matrix.id}`}>
            <CardContainer key={matrix.id} size="sm" className="">
              <CommonHeader size="lg"> {matrix.name}</CommonHeader>
              <CommonHeader size="sm">{matrix.type}</CommonHeader>
            </CardContainer>
          </Link>
        ))}
      </div>
      {showModal && <PriceMatrixModal setShowModal={setShowModal} />}
    </div>
  );
};

export default PricingMatrixSettings;
