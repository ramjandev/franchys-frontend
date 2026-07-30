import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import VideoSkeleton from "@/components/shared/loading/VideoSkeleton";
import {
  useApproveQuoteMutation,
  useDeclineQuoteMutation,
  useGetPublicQuoteQuery,
  useGetQuoteByIdQuery,
} from "@/store/quote/quoteAPI";
import { RootState } from "@/store/store";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FiFileText } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import QuoteHeader from "./QuoteHeader";
import QuoteLineItems from "./QuoteLineItems";
import QuoteStatus from "./QuoteStatus";
import RequestRevisionModal from "./RequestRevisionModal";

const QuotePreview = () => {
  const { id } = useParams();
  const { user } = useSelector((s: RootState) => s.auth);

  const isAdmin = user?.role === "SUPER_ADMIN";

  const { data: adminData, isLoading: adminLoading } = useGetQuoteByIdQuery(
    id!,
    {
      skip: !id || !isAdmin,
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: publicData, isLoading: publicLoading } = useGetPublicQuoteQuery(
    id!,
    {
      skip: !id || isAdmin,
      refetchOnMountOrArgChange: true,
    },
  );

  const quote = isAdmin ? adminData?.data : publicData?.data;
  const isLoading = isAdmin ? adminLoading : publicLoading;

  const navigate = useNavigate();
  const [isAdminView, setIsAdminView] = useState(false);
  const [approveQuote, { isLoading: isApproving }] = useApproveQuoteMutation();
  const [declineQuote, { isLoading: isDeclining }] = useDeclineQuoteMutation();

  const handleApprove = async () => {
    try {
      if (id) {
        await approveQuote(id).unwrap();
      }
    } catch {}
  };

  const handleDecline = async () => {
    try {
      if (id) {
        await declineQuote(id!).unwrap();
      }
    } catch {}
  };
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  return (
    <div
      className={`${isAdmin ? "w-full" : "max-w-[1450px] mx-auto px-10 py-10"}`}
    >
      {isLoading || !quote ? (
        <VideoSkeleton />
      ) : (
        <>
          {isAdmin && (
            <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-6 w-full">
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
                  onClick={() => setIsAdminView(false)}
                  className={`${!isAdminView ? "bg-[#FF8B5A]! text-white!" : ""}`}
                >
                  <BiEdit />
                  Admin View
                </CommonButton>
                <CommonButton
                  variant="secondary"
                  onClick={() => setIsAdminView(true)}
                  className={`${isAdminView ? "bg-[#FF8B5A]! text-white!" : ""}`}
                >
                  <MdOutlineRemoveRedEye />
                  Public Invoice View
                </CommonButton>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3 items-start">
            <CardContainer size="lg" className="flex-1 w-full">
              <QuoteHeader quote={quote} />
              <QuoteLineItems quote={quote} isAdmin={isAdmin} />
            </CardContainer>

            {!isAdminView && isAdmin && (
              <div className=" w-full md:w-72.5 ">
                <QuoteStatus quote={quote} />
              </div>
            )}
          </div>
        </>
      )}
      {!isAdmin && (
        <CardContainer className="py-6 flex gap-4 mt-6">
          <CommonButton
            isLoading={isApproving}
            loadingText="Processing..."
            onClick={handleApprove}
            variant="primaryBlue"
          >
            Approve
          </CommonButton>
          <CommonButton
            onClick={() => setShowRevisionModal(true)}
            variant="ghost"
          >
            Revision
          </CommonButton>
          <CommonButton
            isLoading={isDeclining}
            loadingText="Declining..."
            onClick={handleDecline}
            variant="destructive"
          >
            Decline
          </CommonButton>
        </CardContainer>
      )}
      {showRevisionModal && id && (
        <RequestRevisionModal
          close={() => setShowRevisionModal(false)}
          quoteId={id}
        />
      )}
    </div>
  );
};

export default QuotePreview;
