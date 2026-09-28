import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import { usePdfExport } from "@/components/shared/htmlToPdf/usePdfExport";
import VideoSkeleton from "@/components/shared/loading/VideoSkeleton";
import { useCreateInvoiceMutation } from "@/store/invoice/invoiceAPI";
import {
  useApproveQuoteMutation,
  useDeclineQuoteMutation,
  useGetPublicQuoteQuery,
  useGetQuoteByIdQuery,
} from "@/store/quote/quoteAPI";
import { RootState } from "@/store/store";
import { ArrowLeft, FileCheck } from "lucide-react";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import QuoteHeader from "./QuoteHeader";
import QuoteLineItems from "./QuoteLineItems";
import QuoteStatus from "./QuoteStatus";
import RequestRevisionModal from "./RequestRevisionModal";

const QuotePreview = () => {
  const { id } = useParams();
  const location = useLocation();
  const isPublicUrl = location.pathname.includes("/quotes/public/");
  const { user } = useSelector((s: RootState) => s.auth);

  const isAdmin = !isPublicUrl && user?.role === "SUPER_ADMIN";

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
  const [createInvoice, { isLoading: isConverting }] =
    useCreateInvoiceMutation();
  const { targetRef, exportPdf, isExporting } = usePdfExport<HTMLDivElement>({
    filename: `quote-${quote?.customer}-${new Date().toISOString().slice(0, 10)}.pdf`,
  });
  const handleApprove = async () => {
    try {
      if (id) {
        await approveQuote(id).unwrap();
        toast.success("Quote approved successfully!");
      }
    } catch {
      toast.error("Failed to approve quote.");
    }
  };

  const handleDecline = async () => {
    try {
      if (id) {
        await declineQuote(id!).unwrap();
        toast.success("Quote declined.");
      }
    } catch {
      toast.error("Failed to decline quote.");
    }
  };

  const handleConvertToInvoice = async () => {
    if (!quote) return;
    try {
      const flatLineItems = (quote.groups ?? []).flatMap((g) => g.lineItems);
      const invoiceLineItems = flatLineItems.map((li) => ({
        description: li.description || `${li.category} ${li.itemNumber}`,
        quantity: li.itemsCount || 1,
        unitPrice: Number(li.unitPrice) || 0,
      }));

      await createInvoice({
        customerId: quote.customerId,
        quoteId: quote.id,
        taxRate: Number(quote.taxRate) || 0,
        discount: Number(quote.discount) || 0,
        dueDate: quote.dueDate || undefined,
        notes: quote.notes || undefined,
        lineItems:
          invoiceLineItems.length > 0
            ? invoiceLineItems
            : [
                {
                  description: `Order from Quote ${quote.quoteNumber}`,
                  quantity: 1,
                  unitPrice: Number(quote.subtotal) || 0,
                },
              ],
      }).unwrap();

      navigate("/admin/invoices");
    } catch (err) {
      console.error("Failed to convert quote to invoice", err);
    }
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
            <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-6 w-full no-print">
              <p
                onClick={() => navigate(-1)}
                className="mt-3 cursor-pointer text-skyBlue flex items-center gap-1.5 font-medium"
              >
                <ArrowLeft className="w-5 h-5 " />
                Back to Quotes
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {/* Convert to Invoice Button */}
                <CommonButton
                  variant="primaryBlue"
                  onClick={handleConvertToInvoice}
                  isLoading={isConverting}
                  loadingText="Converting..."
                  title="Convert this quote to an invoice"
                >
                  <FileCheck className="w-4 h-4" />
                  Convert to Invoice
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

          <div
            ref={targetRef}
            className="flex flex-col md:flex-row gap-3 items-start printable-area"
          >
            <CardContainer size="lg" className="flex-1 w-full">
              <QuoteHeader quote={quote} />
              <QuoteLineItems
                quote={quote}
                isAdmin={isAdmin}
                showActions={isPublicUrl || !isAdmin || isAdminView}
                onApprove={handleApprove}
                onRevision={() => setShowRevisionModal(true)}
                onDecline={handleDecline}
                isApproving={isApproving}
                isDeclining={isDeclining}
              />
            </CardContainer>

            {!isAdminView && isAdmin && (
              <div className="w-full md:w-72.5 no-print">
                <QuoteStatus
                  quote={quote}
                  onSubmit={() => exportPdf()}
                  isExporting={isExporting}
                />
              </div>
            )}
          </div>
        </>
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
