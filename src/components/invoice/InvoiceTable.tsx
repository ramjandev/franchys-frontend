import {
  useDeleteInvoiceMutation,
  useSendInvoiceMutation,
  useSendInvoiceReminderMutation,
} from "@/store/invoice/invoiceAPI";
import {
  InvoiceListItem,
  InvoiceSortBy,
} from "@/store/invoice/types/invoiceTypes";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { RxLapTimer } from "react-icons/rx";
import { toast } from "react-toastify";
import { tableDesign } from "../admin/quotes/QuoteLists";
import CommonButton from "../shared/CommonButton";
import DeleteAlert from "../shared/DeleteButton";
import IconActionButton from "../shared/IconActionButton";
import Pagination from "../shared/Pagination";
import StatusBadge from "../shared/StatusBadge";

export interface InvoiceTableHeaderItem {
  label: string;
  align: string;
  key: string;
  sortable?: boolean;
}

const tableHeaders: InvoiceTableHeaderItem[] = [
  { label: "Invoice", align: "text-left", key: "createdAt", sortable: true },
  { label: "Customer", align: "text-left", key: "customer" },
  { label: "Amount", align: "text-left", key: "total", sortable: true },
  { label: "Balance", align: "text-left", key: "amountDue", sortable: true },
  { label: "Status", align: "text-center", key: "status" },
  { label: "Invoice", align: "text-left", key: "send" },
  { label: "Action", align: "text-center", key: "action" },
];

const formatMoney = (n: string) => `$${Number(n).toFixed(2)}`;

interface InvoiceTableProps {
  invoicesData: InvoiceListItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpenDetails: (invoiceId: string) => void;
  onOpenPayment: (invoiceId: string) => void;
  sortBy?: string;
  sortOrder?: string;
  onSort?: (field: InvoiceSortBy) => void;
}
const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoicesData,
  page,
  totalPages,
  onPageChange,
  onOpenDetails,
  onOpenPayment,
  sortBy,
  sortOrder,
  onSort,
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
                <th
                  key={index}
                  className={`${item.align} ${tableDesign.th} ${
                    item.sortable
                      ? "cursor-pointer select-none hover:bg-slate-100 transition-colors"
                      : ""
                  }`}
                  onClick={() => {
                    if (item.sortable && onSort) {
                      onSort(item.key as InvoiceSortBy);
                    }
                  }}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 ${
                      item.align === "text-center" ? "justify-center" : ""
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.sortable && (
                      <span className="text-[#90A1B9]">
                        {sortBy === item.key ? (
                          sortOrder === "asc" ? (
                            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
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
