import { CreditCard, Download, Pencil, Send } from "lucide-react";
const QuoteStatus = () => {
  return (
    <div className="w-52 flex flex-col gap-2.5">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="text-xs font-semibold text-gray-700 mb-2">Status</div>
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-gray-500">Current Status:</span>
          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded">
            Sent
          </span>
        </div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-500">Expires:</span>
          <span className="font-semibold text-gray-900">05/15/2026</span>
        </div>
        <div className="flex justify-between text-xs mb-3">
          <span className="text-gray-500">Quote Total:</span>
          <span className="text-blue-600 font-black text-base">$782.46</span>
        </div>
        <hr className="border-gray-100 mb-3" />
        <div className="text-xs font-semibold text-gray-700 mb-2">Actions</div>
        <button className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg mb-1.5 transition-colors">
          <Send className="w-3 h-3" /> Send to Customer
        </button>
        <button className="w-full flex items-center justify-center gap-1.5 border border-gray-300 bg-white text-gray-700 text-xs font-medium px-3 py-2 rounded-lg mb-1.5 hover:bg-gray-50">
          <Pencil className="w-3 h-3" /> Edit Quote
        </button>
        <button className="w-full flex items-center justify-center gap-1.5 border border-gray-300 bg-white text-gray-700 text-xs font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
          <Download className="w-3 h-3" /> Download PDF
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-700 mb-1.5">
          <CreditCard className="w-3.5 h-3.5" /> Credit Card Fee
        </div>
        <div className="text-[11px] text-orange-600 leading-relaxed">
          A 3.5% processing fee is added when payment is made by credit or debit
          card. The fee applies to the total order amount.
        </div>
      </div>
    </div>
  );
};

export default QuoteStatus;
