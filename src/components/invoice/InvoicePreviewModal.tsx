import ModalAction from "../settings/ModalAction";
import ModalContainer from "../settings/ModalContainer";

interface InvoicePreviewModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const invoice = {
  id: "INV-3001",
  status: "Paid",
  dueDate: "9/25/2025",
  from: {
    company: "PrintFlow Inc.",
    address: "123 Production Way, Austin TX 78701",
  },
  billTo: {
    company: "Bay Area Tech Summit",
    email: "chris@techsummit.io",
  },
  items: [{ description: "Custom Print Order", qty: 1, price: 7290.0 }],
  tax: 810.0,
};

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  setShowModal,
}) => {
  const subtotal = invoice.items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const total = subtotal + invoice.tax;

  return (
    <ModalContainer close={() => setShowModal(false)} title="Invoice Preview">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#1E3A5F] tracking-wide mb-1">
              INVOICE
            </h1>
            <p className="text-[#62748E] text-sm">{invoice.id}</p>
          </div>
          <div className="text-right">
            <span className="inline-block border border-[#00C48C] text-[#00C48C] text-sm font-semibold px-4 py-1 rounded-md mb-2">
              {invoice.status}
            </span>
            <p className="text-white text-sm">Due: {invoice.dueDate}</p>
          </div>
        </div>

        {/* From / Bill To */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-xs text-[#62748E] font-semibold tracking-widest mb-2">
              FROM
            </p>
            <p className="text-[#4A90D9] font-medium">{invoice.from.company}</p>
            <p className="text-white text-sm mt-1">{invoice.from.address}</p>
          </div>
          <div>
            <p className="text-xs text-[#62748E] font-semibold tracking-widest mb-2">
              BILL TO
            </p>
            <p className="text-[#4A90D9] font-medium">
              {invoice.billTo.company}
            </p>
            <p className="text-white text-sm mt-1">{invoice.billTo.email}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-6">
          <div className="grid grid-cols-[1fr_80px_120px_120px] gap-2 pb-2 border-b border-[#1E3A5F]">
            <span className="text-[#4A90D9] font-bold text-sm">
              Description
            </span>
            <span className="text-[#4A90D9] font-bold text-sm text-center">
              Qty
            </span>
            <span className="text-[#4A90D9] font-bold text-sm text-right">
              Price
            </span>
            <span className="text-[#4A90D9] font-bold text-sm text-right">
              Total
            </span>
          </div>

          {invoice.items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_80px_120px_120px] gap-2 py-4 border-b border-[#1E3A5F]"
            >
              <span className="text-white text-sm">{item.description}</span>
              <span className="text-white text-sm text-center">{item.qty}</span>
              <span className="text-white text-sm text-right">
                {fmt(item.price)}
              </span>
              <span className="text-[#4A90D9] text-sm text-right">
                {fmt(item.qty * item.price)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="ml-auto w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#62748E]">Subtotal</span>
            <span className="text-[#4A90D9]">{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#62748E]">Tax</span>
            <span className="text-[#4A90D9]">{fmt(invoice.tax)}</span>
          </div>
          <div className="border-t border-[#1E3A5F] pt-2 flex justify-between">
            <span className="text-[#4A90D9] font-semibold">Total</span>
            <span className="text-[#4A90D9] font-semibold">{fmt(total)}</span>
          </div>
          <div className="border-t border-[#1E3A5F] pt-2 flex justify-between">
            <span className="text-[#00C48C] font-semibold">Paid</span>
            <span className="text-[#00C48C] font-semibold">{fmt(total)}</span>
          </div>
        </div>
      </div>

      <ModalAction close={() => setShowModal(false)} create="Download PDF" />
    </ModalContainer>
  );
};

export default InvoicePreviewModal;
