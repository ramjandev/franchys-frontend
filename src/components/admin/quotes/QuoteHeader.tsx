import logo from "@/assets/images/textLogo.png";
import CommonHeader from "@/components/shared/CommonHeader";
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

  const addressLines = [
    customer?.street,
    [customer?.city, customer?.state, customer?.postalCode]
      .filter(Boolean)
      .join(", "),
  ].filter((line): line is string => Boolean(line));

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
      <div className="flex justify-between items-start pb-4 mb-4 ">
        <div>
          <div className=" w-25 h-22.5 mb-3">
            <img
              src={logo}
              alt="logo"
              className=" w-full h-full object-cover"
            />
          </div>
          <CommonHeader size="xs" className="">
            456 Commerce Avenue
            <br />
            Los Angeles, CA 90001
            <br />
            (555) 987-6543
            <br />
            quotes@printflowpro.com
          </CommonHeader>
        </div>
        <div className=" flex flex-col justify-end ">
          <CommonHeader size="2xl" className="mb-1 justify-end!">
            QUOTE
          </CommonHeader>
          <CommonHeader size="lg" className="text-skyBlue justify-end!">
            {quote?.quoteNumber || "-"}
          </CommonHeader>

          <CommonHeader size="xs" className=" mt-1 justify-end!">
            Date: {formatDate(quote?.createdAt)}
          </CommonHeader>
          <CommonHeader size="xs" className=" mt-1 justify-end!">
            {/* No dedicated "expires" field on Quote — using dueDate */}
            Expires: {formatDate(quote?.dueDate)}
          </CommonHeader>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <div className="text-xs text-[#62748E] font-medium mb-1">
            QUOTE FOR:
          </div>
          <CommonHeader size="lg" className="text-[#0F172B]! font-bold!">
            {customerDisplayName}
          </CommonHeader>{" "}
          <br />
          <CommonHeader size="xs" className=" mt-0.5">
            {contactName && (
              <>
                {contactName}
                <br />
              </>
            )}
            {addressLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
            {customer?.email}
            <br />
            {customer?.phone}
          </CommonHeader>
        </div>
        <div className="w-full  sm:w-60 space-y-3">
          {orderDetails.map((detail, i) => (
            <div
              key={detail.label}
              className="w-full flex justify-between gap-3"
            >
              <CommonHeader size="xs" className="">
                {detail.label}
              </CommonHeader>
              <CommonHeader
                size="xs"
                className={` ${i === 0 ? "text-[#0F172B]! font-bold" : ""} ${i === 3 ? "text-[#E7000B]! font-bold" : ""}`}
              >
                {detail.value}
              </CommonHeader>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteHeader;
