import { CheckCircle, Clock, XCircle } from "lucide-react";

export const transactionsData = [
  {
    id: "PAY-001",
    invoice: "INV-2024-089",
    customer: "Acme Corp",
    amount: "$1250.00",
    date: "2026-05-08",
    method: "Visa •••• 4242",
    status: "Completed",
  },
  {
    id: "PAY-002",
    invoice: "INV-2024-088",
    customer: "TechStart Inc",
    amount: "$750.50",
    date: "2026-05-07",
    method: "Mastercard •••• 5555",
    status: "Completed",
  },
  {
    id: "PAY-003",
    invoice: "INV-2024-087",
    customer: "Creative Agency",
    amount: "$2100.00",
    date: "2026-05-06",
    method: "Bank Transfer",
    status: "Pending",
  },
  {
    id: "PAY-004",
    invoice: "INV-2024-086",
    customer: "Local Bakery",
    amount: "$450.00",
    date: "2026-05-05",
    method: "Visa •••• 4242",
    status: "Failed",
  },
  {
    id: "PAY-005",
    invoice: "INV-2024-085",
    customer: "Fashion Brand",
    amount: "$3200.00",
    date: "2026-05-04",
    method: "Mastercard •••• 5555",
    status: "Completed",
  },
];

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "Completed":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#5CB85C] text-white text-[12px] font-medium shadow-xs">
          <CheckCircle className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#428BCA] text-white text-[12px] font-medium shadow-xs">
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
    case "Failed":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#D9534F] text-white text-[12px] font-medium shadow-xs">
          <XCircle className="w-3.5 h-3.5" />
          Failed
        </span>
      );
    default:
      return null;
  }
};
