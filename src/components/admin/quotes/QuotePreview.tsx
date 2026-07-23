import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FiFileText } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import QuoteHeader from "./QuoteHeader";
import QuoteLineItems from "./QuoteLineItems";
import QuoteStatus from "./QuoteStatus";

const QuotePreview = () => {
  const navigate = useNavigate();
  const [isAdminView, setIsAdminView] = useState(false);
  return (
    <div className="">
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-6">
        <p
          onClick={() => navigate(-1)}
          className="mt-3 cursor-pointer text-skyBlue  flex items-center gap-1.5"
        >
          <ArrowLeft className="w-5 h-5 " />
          Back to Quotes
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <CommonButton
            variant="secondary"
            className="bg-[#FF8B5A]! text-white!"
          >
            <FiFileText />
            Production Sheet
          </CommonButton>
          <CommonButton
            variant="secondary"
            onClick={() => setIsAdminView(true)}
            className={`${isAdminView ? "bg-[#FF8B5A]! text-white!" : ""}`}
          >
            <BiEdit />
            Admin View
          </CommonButton>
          <CommonButton
            variant="secondary"
            onClick={() => setIsAdminView(false)}
            className={`${!isAdminView ? "bg-[#FF8B5A]! text-white!" : ""}`}
          >
            <MdOutlineRemoveRedEye />
            Public Invoice View
          </CommonButton>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start">
        <CardContainer size="lg" className="flex-1 w-full">
          <QuoteHeader />
          <QuoteLineItems />
        </CardContainer>
        {!isAdminView && (
          <div className=" w-full md:w-72.5 ">
            <QuoteStatus />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotePreview;
