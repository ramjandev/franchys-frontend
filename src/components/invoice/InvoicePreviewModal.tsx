import { useGetInvoiceByIdQuery } from "@/store/invoice/invoiceAPI";
import { Image } from "lucide-react";
import { FiPrinter } from "react-icons/fi";
import ModalAction from "../settings/ModalAction";
import ModalContainer from "../settings/ModalContainer";
import CommonHeader from "../shared/CommonHeader";
import VideoSkeleton from "../shared/loading/VideoSkeleton";

interface InvoicePreviewModalProps {
  invoiceId: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoiceId,
  setShowModal,
}) => {
  const { data, isLoading } = useGetInvoiceByIdQuery(invoiceId);
  const invoice = data?.data;

  if (isLoading || !invoice) {
    return (
      <ModalContainer
        close={() => setShowModal(false)}
        title="Invoice Preview"
        size="max-w-xl"
      >
        <VideoSkeleton />
      </ModalContainer>
    );
  }

  const subtotal = Number(invoice.subtotal);
  const tax = Number(invoice.taxAmount);
  const total = Number(invoice.total);
  const isPaid = invoice.status === "PAID";

  const quoteLineItems = invoice.quote?.lineItems ?? [];
  const allMockups = quoteLineItems
    .flatMap((li) => li.mockups || [])
    .filter(Boolean);

  return (
    <ModalContainer
      close={() => setShowModal(false)}
      title="Invoice Preview"
      size="max-w-2xl"
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-invoice-content, .printable-invoice-content * {
            visibility: visible;
          }
          .printable-invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="p-6 printable-invoice-content">
        <div className="flex items-start justify-between mb-6">
          <div>
            <CommonHeader size="3xl" className="font-medium!">
              INVOICE
            </CommonHeader>

            <CommonHeader className="text-[#45556C]!">
              {invoice.invoiceNumber}
            </CommonHeader>
            {invoice.quote?.quoteNumber && (
              <span className="text-xs text-slate-500">
                Ref Quote: {invoice.quote.quoteNumber}
              </span>
            )}
          </div>
          <div className="text-right">
            <span
              className={`inline-block text-sm font-semibold px-4 py-1 rounded-md mb-2 ${
                isPaid
                  ? "bg-[#D0FAE5] text-[#007A55]"
                  : "bg-[#F1F5F9] text-[#45556C]"
              }`}
            >
              {invoice.status}
            </span>
            <CommonHeader size="sm" className="text-[#45556C]!">
              Due:{" "}
              {invoice.dueDate
                ? new Date(invoice.dueDate).toLocaleDateString()
                : "—"}
            </CommonHeader>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-1">
            <CommonHeader size="xs" className="text-[#45556C]!">
              FROM
            </CommonHeader>

            <CommonHeader className="text-[#45556C]!">
              Your Company
            </CommonHeader>
          </div>
          <div className="space-y-1">
            <CommonHeader size="xs" className="text-[#45556C]!">
              BILL TO
            </CommonHeader>
            <CommonHeader className="text-[#45556C]!">
              {invoice.customer.companyName ||
                `${invoice.customer.firstName} ${invoice.customer.lastName}`}
            </CommonHeader>

            <CommonHeader size="sm" className="text-[#45556C]!">
              {invoice.customer.email}
            </CommonHeader>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-4 sm:grid-cols-[1fr_80px_120px_120px] gap-2 pb-2 border-b border-[#F1F5F9]">
            <CommonHeader size="sm" className="text-[#0F172B]! font-bold!">
              Description
            </CommonHeader>
            <CommonHeader size="sm" className="text-[#0F172B]! font-bold!">
              Qty
            </CommonHeader>
            <CommonHeader size="sm" className="text-[#0F172B]! font-bold!">
              Price
            </CommonHeader>
            <CommonHeader
              size="sm"
              className="text-[#0F172B]! font-bold! justify-end!"
            >
              Total
            </CommonHeader>
          </div>

          {invoice.lineItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-4 sm:grid-cols-[1fr_80px_120px_120px] gap-2 py-4 border-b border-[#E2E8F0]"
            >
              <CommonHeader className="text-[#45556C]! ">
                {item.description}
              </CommonHeader>
              <CommonHeader className="text-[#45556C]! ">
                {item.quantity}
              </CommonHeader>
              <CommonHeader className="text-[#45556C]! ">
                {fmt(Number(item.unitPrice))}
              </CommonHeader>
              <CommonHeader className="text-[#45556C]! justify-end!">
                {fmt(Number(item.total))}
              </CommonHeader>
            </div>
          ))}
        </div>

        {/* Attached Mockups */}
        {allMockups.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <Image size={14} className="text-slate-500" />
              Attached Mockups ({allMockups.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {allMockups.map((url, i) => (
                <a
                  key={url + i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-16 h-16 rounded-md border border-slate-200 bg-white overflow-hidden hover:scale-105 transition shadow-xs"
                >
                  <img
                    src={url}
                    alt={`Mockup ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="ml-auto w-64 space-y-2">
          <div className="flex justify-between">
            <CommonHeader size="sm" className="">
              Subtotal
            </CommonHeader>
            <CommonHeader size="sm" className="">
              {fmt(subtotal)}
            </CommonHeader>
          </div>
          <div className="flex justify-between">
            <CommonHeader size="sm" className="">
              Tax
            </CommonHeader>
            <CommonHeader size="sm" className="">
              {fmt(tax)}
            </CommonHeader>
          </div>
          <div className="border-t border-[#E2E8F0] pt-2 flex justify-between">
            <CommonHeader size="lg">Total</CommonHeader>
            <CommonHeader size="lg">{fmt(total)}</CommonHeader>
          </div>
          {isPaid && (
            <div className="border-t border-[#A4F4CF] pt-2 flex justify-between">
              <CommonHeader size="sm" className="text-[#007A55]! ">
                Paid
              </CommonHeader>
              <CommonHeader size="sm" className="text-[#007A55]! ">
                {fmt(Number(invoice.amountPaid))}
              </CommonHeader>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 transition cursor-pointer"
        >
          <FiPrinter size={14} /> Print Invoice
        </button>

        <ModalAction
          close={() => setShowModal(false)}
          create="Download PDF"
          isSubmitting={false}
          loadingText="Downloading..."
          onSubmit={() => {
            if (invoice.invoicePdfUrl) {
              window.open(invoice.invoicePdfUrl, "_blank");
            } else {
              window.print();
            }
          }}
        />
      </div>
    </ModalContainer>
  );
};

export default InvoicePreviewModal;
