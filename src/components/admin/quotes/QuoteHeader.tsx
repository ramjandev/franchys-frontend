import logo from "@/assets/images/textLogo.png";
import { Quote } from "@/store/quote/types/quoteTypes";

interface QuoteHeaderProps {
  quote?: Quote;
}

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const QuoteHeader: React.FC<QuoteHeaderProps> = ({ quote }) => {
  const customer = quote?.customer;
  const rep = quote?.rep;

  const customerDisplayName =
    customer?.companyName ||
    `${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`.trim() ||
    "-";

  const contactName =
    customer?.companyName && (customer?.firstName || customer?.lastName)
      ? `${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`.trim()
      : null;



  const orderDetails = [
    {
      label: "Sales Rep:",
      value: rep?.name || "-",
    },
    {
      label: "Delivery Method:",
      value: quote?.deliveryMethod || "-",
    },
    {
      label: "PO Number:",
      value: quote?.poNumber || "-",
    },
    {
      label: "Customer Due Date:",
      value: formatDate(quote?.dueDate),
    },
    {
      // Not returned by the API — no separate production-due-date field
      // exists on Quote, so this stays blank until the backend adds one.
      label: "Production Due Date:",
      value: "-",
    },
  ];

  return (
    <div className="mb-6">
      {/* Top Company & Quote Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 mb-2">
        <div>
          <div className="w-32 h-auto mb-3">
            <img
              src={logo}
              alt="logo"
              className="w-full h-auto object-contain max-h-16"
            />
          </div>
          <div className="text-xs text-slate-500 space-y-0.5 leading-relaxed">
            <div>456 Commerce Avenue</div>
            <div>Los Angeles, CA 90001</div>
            <div>(555) 987-6543</div>
            <div>quotes@printflowpro.com</div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end text-left sm:text-right">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            QUOTE
          </div>
          <div className="text-base sm:text-lg font-bold text-sky-600 mt-0.5">
            {quote?.quoteNumber || "-"}
          </div>

          <div className="mt-2 text-xs text-slate-500 space-y-0.5">
            <div>
              <span className="font-semibold text-slate-700">Date:</span>{" "}
              {formatDate(quote?.createdAt)}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Expires:</span>{" "}
              {formatDate(quote?.dueDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Quote For & Order Details Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-5 border-t border-slate-200">
        {/* Customer Information */}
        <div className="flex-1 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Quote For:
          </div>
          <div className="text-xl font-bold text-slate-900">
            {customerDisplayName}
          </div>
          {contactName && (
            <div className="text-sm font-semibold text-slate-700">
              {contactName}
            </div>
          )}
          {customer?.street && (
            <div className="text-xs text-slate-600">{customer.street}</div>
          )}
          {[customer?.city, customer?.state, customer?.postalCode]
            .filter(Boolean)
            .join(", ") && (
            <div className="text-xs text-slate-600">
              {[customer?.city, customer?.state, customer?.postalCode]
                .filter(Boolean)
                .join(", ")}
            </div>
          )}
          {customer?.country && (
            <div className="text-xs text-slate-600">{customer.country}</div>
          )}
          <div className="pt-2 flex flex-col gap-1 text-xs text-slate-600">
            {customer?.email && (
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-700">Email:</span>
                <span className="text-slate-600">{customer.email}</span>
              </div>
            )}
            {customer?.phone && (
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-700">Phone:</span>
                <span className="text-slate-600">{customer.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Details / Metadata table on right */}
        <div className="w-full sm:w-72 bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2.5">
          {orderDetails.map((detail, i) => (
            <div
              key={detail.label}
              className="w-full flex items-center justify-between text-xs"
            >
              <span className="text-slate-500 font-medium">
                {detail.label}
              </span>
              <span
                className={`font-semibold text-right ${
                  i === 0
                    ? "text-slate-900 font-bold"
                    : i === 3
                      ? "text-red-600 font-bold"
                      : "text-slate-800"
                }`}
              >
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteHeader;
