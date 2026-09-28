import DeleteAlert from "@/components/shared/DeleteButton";
import IconActionButton from "@/components/shared/IconActionButton";
import Pagination from "@/components/shared/Pagination";
import StatusBadge from "@/components/shared/StatusBadge";
import { useCreateInvoiceMutation } from "@/store/invoice/invoiceAPI";
import { useDeleteQuoteMutation } from "@/store/quote/quoteAPI";
import { Quote } from "@/store/quote/types/quoteTypes";
import { FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const tableDesign = {
  table:
    "w-full border-collapse border border-border rounded-lg overflow-hidden",
  thead: "text-xs text-[#45556C]! bg-[#F8FAFC]",
  tbody: "text-[#0F172B] bg-white",
  tr: "text-[#101828] text-sm hover:bg-slate-50 transition-colors",
  th: "py-4 px-6 text-xs font-semibold text-[#4A5565] border-b border-border",
  td: "py-4 px-6 text-sm text-[#101828] border-b border-border",
};

const tableHeaders = [
  { label: "Quote", align: "text-left" },
  { label: "Customer", align: "text-left" },
  { label: "Items", align: "text-left" },
  { label: "Total", align: "text-left" },
  { label: "Status", align: "text-center" },
  { label: "Date", align: "text-left" },
  { label: "Action", align: "text-center" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

interface QuoteListsProps {
  quotes: Quote[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const QuoteLists: React.FC<QuoteListsProps> = ({
  quotes,
  page,
  totalPages,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const [deleteQuote] = useDeleteQuoteMutation();
  const [createInvoice] = useCreateInvoiceMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteQuote(id).unwrap();
    } catch (err) {
      console.error("Failed to delete quote", err);
    }
  };

  const handleConvertToInvoice = async (quote: Quote) => {
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

      toast.success(`Quote ${quote.quoteNumber} converted to Invoice!`);
      navigate("/admin/invoices");
    } catch (err) {
      console.error("Failed to convert quote to invoice", err);
      toast.error("Failed to convert quote to invoice.");
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden">
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
            {quotes.map((quote) => {
              const itemsCount = quote.lineItems?.length ?? 0;
              return (
                <tr key={quote.id} className={tableDesign.tr}>
                  <td className={tableDesign.td}>
                    <span className="">{quote.quoteNumber}</span>
                  </td>

                  <td className={` ${tableDesign.td} text-left! `}>
                    {quote.customer
                      ? `${quote.customer.firstName} ${quote.customer.lastName}`
                      : "—"}
                  </td>

                  <td className={tableDesign.td}>
                    {itemsCount} {itemsCount === 1 ? "product" : "products"}
                  </td>

                  <td className={`font-semibold ${tableDesign.td}`}>
                    ${quote.total}
                  </td>

                  <td className={` ${tableDesign.td} text-center`}>
                    <StatusBadge status={quote.status.toLowerCase()} />
                  </td>

                  <td className={tableDesign.td}>
                    {formatDate(quote.createdAt)}
                  </td>

                  <td className={tableDesign.td}>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => handleConvertToInvoice(quote)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                        title="Convert to Invoice"
                      >
                        <FileCheck size={16} />
                      </button>
                      <IconActionButton
                        variant="view"
                        title="View"
                        onClick={() =>
                          navigate(`../quotes/preview/${quote.id}`)
                        }
                      />
                      <DeleteAlert action={() => handleDelete(quote.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}
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

export default QuoteLists;
