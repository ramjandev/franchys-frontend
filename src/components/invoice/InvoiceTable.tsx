import {
  useDeleteInvoiceMutation,
  useSendInvoiceMutation,
  useSendInvoiceReminderMutation,
} from "@/store/invoice/invoiceAPI";
import { InvoiceListItem } from "@/store/invoice/types/invoiceTypes";
import { RxLapTimer } from "react-icons/rx";
import { toast } from "react-toastify";
import { tableDesign } from "../admin/quotes/QuoteLists";
import CommonButton from "../shared/CommonButton";
import DeleteAlert from "../shared/DeleteButton";
import IconActionButton from "../shared/IconActionButton";
import Pagination from "../shared/Pagination";
import StatusBadge from "../shared/StatusBadge";

const tableHeaders = [
  { label: "Invoice", align: "text-left" },
  { label: "Customer", align: "text-left" },
  { label: "Amount", align: "text-left" },
  { label: "Balance", align: "text-left" },
  { label: "Status", align: "text-center" },
  { label: "Invoice", align: "text-left" },
  { label: "Action", align: "text-center" },
];

const formatMoney = (n: string) => `$${Number(n).toFixed(2)}`;

interface InvoiceTableProps {
  invoicesData: InvoiceListItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpenDetails: (invoiceId: string) => void;
  onOpenPayment: (invoiceId: string) => void;
}
const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoicesData,
  page,
  totalPages,
  onPageChange,
  onOpenDetails,
  onOpenPayment,
}) => {
  const [sendInvoice, { isLoading, originalArgs }] = useSendInvoiceMutation();
  const [
    sendInvoiceReminder,
    { isLoading: isLoadingReminder, originalArgs: originalArgsReminder },
  ] = useSendInvoiceReminderMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const handleSend = async (id: string) => {
    try {
      await sendInvoice({
        id,
        data: { sendEmail: true, sendWhatsApp: true },
      }).unwrap();
    } catch (err) {
      console.error("Failed to send invoice", err);
    }
  };

  const handleSendReminder = async (id: string) => {
    try {
      await sendInvoiceReminder(id).unwrap();
    } catch (err) {
      console.error("Failed to send invoice reminder", err);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await deleteInvoice(id).unwrap();
      toast.success("Invoice deleted successfully");
    } catch (err: unknown) {
      console.error("Failed to delete invoice", err);
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr?.data?.message || "Failed to delete invoice");
    }
  };

  return (
    <div className="bg-white rounded-xl  overflow-hidden">
      <div className="overflow-x-auto">
        <table className={tableDesign.table}>
          <thead className={tableDesign.thead}>
            <tr>
              {tableHeaders.map((item, index) => (
                <th key={index} className={`${item.align} ${tableDesign.th}`}>
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={tableDesign.tbody}>
            {invoicesData.length === 0 && (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className={`${tableDesign.td} text-center text-[#5C7899]`}
                >
                  No invoices found.
                </td>
              </tr>
            )}
            {invoicesData.map((invoice) => (
              <tr key={invoice.id} className={tableDesign.tr}>
                <td
                  onClick={() => onOpenDetails(invoice.id)}
                  className={tableDesign.td}
                >
                  <span className="text-[#0077FF] font-medium hover:underline cursor-pointer">
                    {invoice.invoiceNumber}
                  </span>
                </td>
                <td className={tableDesign.td}>
                  <div className="text-[#101828] font-medium">
                    {`${invoice.customer.firstName} ${invoice.customer.lastName || ""}`.trim()}
                  </div>
                  {invoice.quote?.quoteNumber && (
                    <div className="text-xs text-[#A0B0C0] mt-0.5">
                      {invoice.quote.quoteNumber}
                    </div>
                  )}
                </td>
                <td className={`${tableDesign.td} font-semibold`}>
                  {formatMoney(invoice.total)}
                </td>
                <td className={`${tableDesign.td} font-semibold`}>
                  {formatMoney(invoice.amountDue)}
                </td>
                <td className={`${tableDesign.td} text-center`}>
                  <StatusBadge status={invoice.status.toLowerCase()} />
                </td>
                <td className={tableDesign.td}>
                  {invoice.status !== "PAID" && (
                    <CommonButton
                      onClick={() => handleSend(invoice.id)}
                      isLoading={originalArgs?.id === invoice.id && isLoading}
                      loadingText="Sending..."
                      size="xs"
                    >
                      Send Invoice
                    </CommonButton>
                  )}
                </td>
                <td className={`${tableDesign.td} text-center`}>
                  <div className="flex items-center gap-2 justify-center">
                    {invoice.status !== "PAID" && (
                      <IconActionButton
                        variant="edit"
                        title="Edit"
                        onClick={() => onOpenPayment(invoice.id)}
                      />
                    )}

                    <DeleteAlert
                      action={() => handleDeleteInvoice(invoice.id)}
                    />

                    {invoice.status === "OVERDUE" && (
                      <button
                        className="cursor-pointer"
                        onClick={() => handleSendReminder(invoice.id)}
                        disabled={
                          originalArgsReminder === invoice.id &&
                          isLoadingReminder
                        }
                        title={
                          originalArgsReminder === invoice.id &&
                          isLoadingReminder
                            ? "Sending..."
                            : "Send Reminder"
                        }
                      >
                        <RxLapTimer className="w-4 h-4 mr-1" />
                      </button>
                      // <CommonButton
                      //   onClick={() => handleSendReminder(invoice.id)}
                      //   isLoading={
                      //     originalArgsReminder === invoice.id &&
                      //     isLoadingReminder
                      //   }
                      //   loadingText="Sending..."
                      //   size="xs"
                      //   variant="destructive"
                      // >
                      //   <RxLapTimer className="w-4 h-4 mr-1" />
                      // </CommonButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="py-5">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default InvoiceTable;
