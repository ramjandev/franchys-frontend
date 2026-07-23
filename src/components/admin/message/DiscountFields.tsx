import { inputClass } from "@/pages/Login";
import type { DiscountVals } from "./MessageData";

interface DiscountFieldsProps {
  vals: DiscountVals;
  set: (v: DiscountVals) => void;
}
const DiscountFields: React.FC<DiscountFieldsProps> = ({ vals, set }) => (
  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col gap-4">
    <p className="m-0 font-bold text-sm text-green-600 flex items-center gap-1.5">
      🏷️ Discount
    </p>
    <div>
      <label className={inputClass.label}>Discount Code</label>
      <input
        value={vals.discountCode}
        onChange={(e) => set({ ...vals, discountCode: e.target.value })}
        placeholder="E.G. SAVE15"
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
      <label className={inputClass.label}>Applies To</label>
      <input
        value={vals.appliesTo}
        onChange={(e) => set({ ...vals, appliesTo: e.target.value })}
        className={inputClass.input}
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={inputClass.label}>Minimum Order ($)</label>
        <input
          value={vals.minOrder}
          onChange={(e) => set({ ...vals, minOrder: e.target.value })}
          placeholder="0.00"
          className={inputClass.input}
        />
      </div>
      <div>
        <label className={inputClass.label}>Expiry Date</label>
        <input
          type="date"
          value={vals.expiry}
          onChange={(e) => set({ ...vals, expiry: e.target.value })}
          className={inputClass.input}
        />
      </div>
    </div>
    <div>
      <label className={inputClass.label}>
        Usage Limit (leave blank for unlimited)
      </label>
      <input
        value={vals.usageLimit}
        onChange={(e) => set({ ...vals, usageLimit: e.target.value })}
        placeholder="e.g. 500"
        className={inputClass.input}
      />
    </div>
  </div>
);

export default DiscountFields;
