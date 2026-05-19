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
      <div className="flex items-center justify-between mb-6">
        <p
          onClick={() => navigate(-1)}
          className="mt-3 cursor-pointer text-skyBlue  flex items-center gap-1.5"
        >
          <ArrowLeft className="w-5 h-5 " />
          Back to Quotes
        </p>
        <div className="flex items-center gap-2">
          <CommonButton className="bg-[#FF8B5A]! text-white!">
            <FiFileText className="w-3.5 h-3.5" />
            Production Sheet
          </CommonButton>
          <CommonButton onClick={() => setIsAdminView(false)} className="">
            <BiEdit className="w-3.5 h-3.5" />
            Admin View
          </CommonButton>
          <CommonButton onClick={() => setIsAdminView(true)} className="">
            <MdOutlineRemoveRedEye className="w-3.5 h-3.5" />
            Public Invoice View
          </CommonButton>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <CardContainer size="lg" className="flex-1 w-full">
          <QuoteHeader />
          <QuoteLineItems />
        </CardContainer>
        {!isAdminView && <QuoteStatus />}
      </div>
    </div>
  );
};

export default QuotePreview;
