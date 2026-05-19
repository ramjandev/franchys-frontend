import { inputClass } from "@/pages/Login";
import { useState } from "react";
import ModalAction from "../settings/ModalAction";
import ModalContainer from "../settings/ModalContainer";

interface PaymentModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceId?: string;
  balance?: number;
}

const paymentMethods = [
  { label: "Cash", value: "cash" },
  { label: "Credit Card", value: "credit_card" },
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Check", value: "check" },
  { label: "PayPal", value: "paypal" },
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
        {/* Invoice / Balance row */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-[#62748E] mb-1">Invoice</p>
            <p className="text-sm font-medium text-[#62748E]">{invoiceId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#62748E] mb-1">Balance</p>
            <p className="text-lg font-semibold text-[#E7000B]">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
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

        {/* Method */}
        <div className="space-y-2">
          <label className={inputClass.label}>Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`${inputClass.input} cursor-pointer`}
          >
            <option value="" disabled />
            {paymentMethods.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ModalAction
        close={() => setShowModal(false)}
        create={`Process $${processAmount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`}
      />
    </ModalContainer>
  );
};

export default PaymentModal;
