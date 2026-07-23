import { inputClass } from "@/pages/Admin/MockupBuilder/components/LeftPanel";
import type { PromotionVals } from "./MessageData";

interface PromotionValsProps {
  vals: PromotionVals;
  set: (v: PromotionVals) => void;
}
const PromotionFields: React.FC<PromotionValsProps> = ({ vals, set }) => (
  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-4">
    <p className="m-0 font-bold text-sm text-orange-600 flex items-center gap-1.5">
      📈 Promotion
    </p>
    <div>
      <label className={inputClass.label}>Promo Code</label>
      <input
        value={vals.promoCode}
        onChange={(e) => set({ ...vals, promoCode: e.target.value })}
        placeholder="E.G. SUMMER20"
        className={inputClass.input}
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={inputClass.label}>Discount Type</label>
        <input
          value={vals.discountType}
          onChange={(e) => set({ ...vals, discountType: e.target.value })}
          className={inputClass.input}
        />
      </div>
      <div>
        <label className={inputClass.label}>Percentage (%)</label>
        <input
          value={vals.percentage}
          onChange={(e) => set({ ...vals, percentage: e.target.value })}
          placeholder="% 0"
          className={inputClass.input}
        />
      </div>
    </div>
    <div>
      <label className={inputClass.label}>Minimum Order Amount ($)</label>
      <input
        value={vals.minOrder}
        onChange={(e) => set({ ...vals, minOrder: e.target.value })}
        placeholder="0.00 (leave blank for no minimum)"
        className={inputClass.input}
      />
    </div>
    <div>
      <label className={inputClass.label}>Promotion Period</label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={vals.startDate}
            onChange={(e) => set({ ...vals, startDate: e.target.value })}
            className={inputClass.input}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">End Date</label>
          <input
            type="date"
            value={vals.endDate}
            onChange={(e) => set({ ...vals, endDate: e.target.value })}
            className={inputClass.input}
          />
        </div>
      </div>
    </div>
    <div>
      <label className={inputClass.label}>Terms & Conditions</label>
      <textarea
        value={vals.terms}
        onChange={(e) => set({ ...vals, terms: e.target.value })}
        placeholder="e.g. Valid on orders over minimum. Cannot be combined with other offers..."
        rows={3}
        className={`${inputClass.input} resize-none`}
      />
    </div>
  </div>
);

export default PromotionFields;
