import ModalAction from "../settings/ModalAction";
import ModalContainer from "../settings/ModalContainer";
import CommonHeader from "../shared/CommonHeader";

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
    <ModalContainer
      close={() => setShowModal(false)}
      title="Invoice Preview"
      size="max-w-xl"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <CommonHeader size="3xl" className="font-medium!">
              INVOICE
            </CommonHeader>

            <CommonHeader className="text-[#45556C]!">
              Due: {invoice.id}
            </CommonHeader>
          </div>
          <div className="text-right">
            <span className="inline-block bg-[#D0FAE5] text-[#007A55] text-sm font-semibold px-4 py-1 rounded-md mb-2">
              {invoice.status}
            </span>
            <CommonHeader size="sm" className="text-[#45556C]!">
              Due: {invoice.dueDate}
            </CommonHeader>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-1">
            <CommonHeader size="xs" className="text-[#45556C]!">
              FROM
            </CommonHeader>

            <CommonHeader className="text-[#45556C]!">
              {invoice.from.company}
            </CommonHeader>
            <CommonHeader size="sm" className="text-[#45556C]!">
              {invoice.from.address}
            </CommonHeader>
          </div>
          <div className="space-y-1">
            <CommonHeader size="xs" className="text-[#45556C]!">
              BILL TO
            </CommonHeader>
            <CommonHeader className="text-[#45556C]!">
              {invoice.billTo.company}
            </CommonHeader>

            <CommonHeader size="sm" className="text-[#45556C]!">
              {invoice.billTo.email}
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

          {invoice.items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-4 sm:grid-cols-[1fr_80px_120px_120px] gap-2 py-4 border-b border-[#E2E8F0]"
            >
              <CommonHeader className="text-[#45556C]! ">
                {item.description}
              </CommonHeader>
              <CommonHeader className="text-[#45556C]! ">
                {item.qty}
              </CommonHeader>
              <CommonHeader className="text-[#45556C]! ">
                {fmt(item.price)}
              </CommonHeader>
              <CommonHeader className="text-[#45556C]! justify-end!">
                {fmt(item.qty * item.price)}
              </CommonHeader>
            </div>
          ))}
        </div>

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
              {fmt(invoice.tax)}
            </CommonHeader>
          </div>
          <div className="border-t border-[#E2E8F0] pt-2 flex justify-between">
            <CommonHeader size="lg">Total</CommonHeader>
            <CommonHeader size="lg">{fmt(total)}</CommonHeader>
          </div>
          <div className="border-t border-[#A4F4CF] pt-2 flex justify-between">
            <CommonHeader size="sm" className="text-[#007A55]! ">
              Paid
            </CommonHeader>
            <CommonHeader size="sm" className="text-[#007A55]! ">
              {fmt(total)}
            </CommonHeader>
          </div>
        </div>
      </div>

      <ModalAction close={() => setShowModal(false)} create="Download PDF" />
    </ModalContainer>
  );
};

export default InvoicePreviewModal;
