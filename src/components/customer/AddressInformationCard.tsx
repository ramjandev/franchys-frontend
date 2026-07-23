import { inputClass } from "@/pages/Login";
import { MapPin } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import CommonSelect from "../shared/CommonSelect";
import { CustomerFormValues } from "./schema/customerSchema";

interface AddressInformationCardProps {
  register: UseFormRegister<CustomerFormValues>;
  control: Control<CustomerFormValues>;
  errors: FieldErrors<CustomerFormValues>;
}

const countryOptions = [
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "United Kingdom", value: "United Kingdom" },
];

const AddressInformationCard: React.FC<AddressInformationCardProps> = ({
  register,
  control,
  errors,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
          <MapPin className="w-5 h-5 text-[#10B981]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            Address Information
          </h2>
          <p className="text-xs text-[#5C7899]">Billing and shipping address</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className={inputClass.label}>Street Address</label>
          <input
            placeholder="123 Main Street, Suite 100"
            className={inputClass.input}
            {...register("street")}
          />
          {errors.street && (
            <p className="text-xs text-red-500">{errors.street.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={inputClass.label}>City</label>
            <input
              placeholder="New York"
              className={inputClass.input}
              {...register("city")}
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className={inputClass.label}>State / Province</label>
            <input
              placeholder="NY"
              className={inputClass.input}
              {...register("state")}
            />
            {errors.state && (
              <p className="text-xs text-red-500">{errors.state.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className={inputClass.label}>ZIP / Postal Code</label>
            <input
              placeholder="10001"
              className={inputClass.input}
              {...register("postalCode")}
            />
            {errors.postalCode && (
              <p className="text-xs text-red-500">
                {errors.postalCode.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className={inputClass.label}>Country</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  item={countryOptions}
                  placeholder="Select country"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="w-full"
                />
              )}
            />
            {errors.country && (
              <p className="text-xs text-red-500">{errors.country.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInformationCard;
