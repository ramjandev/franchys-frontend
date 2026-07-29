import CommonButton from "@/components/shared/CommonButton";
import DeleteAlert from "@/components/shared/DeleteButton";
import IconActionButton from "@/components/shared/IconActionButton";
import Pagination from "@/components/shared/Pagination";
import StatusBadge from "@/components/shared/StatusBadge";
import { useDeleteQuoteMutation } from "@/store/quote/quoteAPI";
import { Quote } from "@/store/quote/types/quoteTypes";
import { useNavigate } from "react-router-dom";

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
  { label: "Mockup", align: "text-center" },
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
  const [deleteQuote] = useDeleteQuoteMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteQuote(id).unwrap();
    } catch (err) {
      console.error("Failed to delete quote", err);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl  overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
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

                  <td className={` ${tableDesign.td} text-center `}>
                    <CommonButton to="../mockups" size="xs">
                      Create Mockup
                    </CommonButton>
                  </td>

                  <td className={tableDesign.td}>
                    <div className="flex items-center gap-2 justify-center">
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
