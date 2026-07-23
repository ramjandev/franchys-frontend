import { inputClass } from "@/pages/Login";
import { FileText } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CustomerFormValues } from "./schema/customerSchema";

interface OrderDetailsProps {
  register: UseFormRegister<CustomerFormValues>;
  errors: FieldErrors<CustomerFormValues>;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ register, errors }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#FAF5FF] flex items-center justify-center">
          <FileText className="w-5 h-5 text-[#7E22CE]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827]">Order Details</h2>
          <p className="text-xs text-[#5C7899]">Event or gift information</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className={inputClass.label}>
            Order Purpose <span className="text-red-500">*</span>
          </label>
          <input
            placeholder=""
            className={inputClass.input}
            {...register("orderPurpose")}
          />
          {errors.orderPurpose && (
            <p className="text-xs text-red-500">
              {errors.orderPurpose.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={inputClass.label}>Event Type</label>
            <input
              placeholder="e.g., Garden Wedding, 50th Birthday"
              className={inputClass.input}
              {...register("eventType")}
            />
          </div>
          <div className="space-y-2">
            <label className={inputClass.label}>Event Date</label>
            <input
              type="date"
              className={inputClass.input}
              {...register("eventDate")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
