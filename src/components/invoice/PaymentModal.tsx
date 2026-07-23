import { inputClass } from "@/pages/Login";
import { useState } from "react";
import ModalAction from "../settings/ModalAction";
import ModalContainer from "../settings/ModalContainer";
import CommonHeader from "../shared/CommonHeader";
import CommonSelect from "../shared/CommonSelect";

interface PaymentModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceId?: string;
  balance?: number;
}

const paymentMethods = [
  { label: "Credit Card (Stripe)", value: "credit_card_stripe" },
  { label: "ACH Transfer", value: "ach_transfer" },
  { label: "Check", value: "check" },
  { label: "Cash", value: "cash" },
];
const PaymentModal: React.FC<PaymentModalProps> = ({
  setShowModal,
  invoiceId = "INV-3002",
  balance = 600,
}) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");

  const processAmount = amount ? parseFloat(amount) : balance;

  return (
    <ModalContainer close={() => setShowModal(false)} title="Process Payment">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className=" space-y-1">
            <CommonHeader size="sm" className="text-[#45556C]!">
              Invoice
            </CommonHeader>
            <CommonHeader className="text-[#45556C]!">{invoiceId}</CommonHeader>
          </div>
          <div className=" space-y-1">
            <CommonHeader size="sm" className="text-[#45556C]!">
              Balance
            </CommonHeader>
            <CommonHeader size="xl" className="text-[#E7000B]!">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </CommonHeader>
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className={inputClass.label}>Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#62748E] text-sm">
              $
            </span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`${inputClass.input} pl-7`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={inputClass.label}>Method</label>

          <CommonSelect
            value={method}
            onValueChange={(e) => setMethod(e)}
            item={paymentMethods}
            placeholder="Select a payment method"
            className="w-full! "
          />
        </div>
      </div>

      <ModalAction
        close={() => setShowModal(false)}
        create={`Process $${processAmount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`}
        onSubmit={() => setShowModal(false)}
      />
    </ModalContainer>
  );
};

export default PaymentModal;
