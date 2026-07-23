import { inputClass } from "@/pages/Login";

import { Vendor } from "@/store/settings/vendors/types/vendorTypes";
import {
  useCreateVendorMutation,
  useUpdateVendorStatusMutation,
} from "@/store/settings/vendors/vendorAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CommonHeader from "../shared/CommonHeader";
import ModalAction from "./ModalAction";
import ModalContainer from "./ModalContainer";

const vendorSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  fax: z.string().optional(),
  accountNumber: z.string().optional(),
  mainAddress: z.string().min(1, "Address is required"),
  optionalAddress: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zip: z.string().min(1, "Zip is required"),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

interface AddVendorModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  vendor?: Vendor;
}

const generalFields: {
  label: string;
  name: keyof VendorFormValues;
  placeholder: string;
  type?: string;
}[] = [
  { label: "Company", name: "companyName", placeholder: "Company name" },
  { label: "Name", name: "contactName", placeholder: "Contact name" },
  {
    label: "Email",
    name: "email",
    placeholder: "john@example.com, tim@email.com",
    type: "email",
  },
  { label: "Phone", name: "phone", placeholder: "Phone number", type: "tel" },
  { label: "Fax", name: "fax", placeholder: "Fax number" },
  {
    label: "Account number",
    name: "accountNumber",
    placeholder: "Account number",
  },
];

const addressFields: {
  label: string;
  name: keyof VendorFormValues;
  placeholder: string;
}[] = [
  { label: "Address", name: "mainAddress", placeholder: "Street address" },
  {
    label: "Address 2",
    name: "optionalAddress",
    placeholder: "Apartment, suite, etc.",
  },
  { label: "City", name: "city", placeholder: "City" },
  { label: "State", name: "state", placeholder: "" },
  { label: "Country", name: "country", placeholder: "" },
  { label: "Zip", name: "zip", placeholder: "Zip code" },
];

const AddVendorModal: React.FC<AddVendorModalProps> = ({
  setShowModal,
  vendor,
}) => {
  const isEdit = Boolean(vendor);

  const [createVendor, { isLoading: isCreating }] = useCreateVendorMutation();
  const [updateVendor, { isLoading: isUpdating }] =
    useUpdateVendorStatusMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      companyName: vendor?.companyName ?? "",
      contactName: vendor?.contactName ?? "",
      email: vendor?.email ?? "",
      phone: vendor?.phone ?? "",
      fax: vendor?.fax ?? "",
      accountNumber: vendor?.accountNumber ?? "",
      mainAddress: vendor?.mainAddress ?? "",
      optionalAddress: vendor?.optionalAddress ?? "",
      city: vendor?.city ?? "",
      state: vendor?.state ?? "",
      country: vendor?.country ?? "",
      zip: vendor?.zip ?? "",
    },
  });

  const onSubmit = async (values: VendorFormValues) => {
    try {
      if (isEdit && vendor) {
        await updateVendor({
          id: vendor.vendorId,
          data: { ...values, status: vendor.status },
        }).unwrap();
      } else {
        await createVendor({ ...values, status: "ACTIVE" }).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save vendor", err);
    }
  };

  return (
    <ModalContainer
      close={() => setShowModal(false)}
      title={isEdit ? "Edit Vendor" : "Add New Vendor"}
      size="max-w-3xl"
    >
      <form>
        <div className="p-6 space-y-6">
          <div>
            <CommonHeader
              size="lg"
              className="border-b border-border pb-3 mb-4"
            >
              General
            </CommonHeader>
            <div className="space-y-4">
              {generalFields.map(
                ({ label, name, placeholder, type = "text" }) => (
                  <div key={label} className="grid grid-cols-[180px_1fr] gap-4">
                    <label className={`${inputClass.label} text-right`}>
                      {label}
                    </label>
                    <div>
                      <input
                        type={type}
                        placeholder={placeholder}
                        className={inputClass.input}
                        {...register(name)}
                      />
                      {errors[name] && (
                        <p className="text-xs text-[#E7000B] mt-1">
                          {errors[name]?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <CommonHeader
              size="lg"
              className="border-b border-border pb-3 mb-4"
            >
              Address
            </CommonHeader>{" "}
            <div className="space-y-4">
              {addressFields.map(({ label, name, placeholder }) => (
                <div key={label} className="grid grid-cols-[180px_1fr] gap-4">
                  <label className={`${inputClass.label} text-right`}>
                    {label}
                  </label>
                  <div>
                    <input
                      type="text"
                      placeholder={placeholder}
                      className={inputClass.input}
                      {...register(name)}
                    />
                    {errors[name] && (
                      <p className="text-xs text-[#E7000B] mt-1">
                        {errors[name]?.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>{" "}
      <ModalAction
        close={() => setShowModal(false)}
        create={isEdit ? "Save Changes" : "Create Vendor"}
        isSubmitting={isCreating || isUpdating}
        onSubmit={handleSubmit(onSubmit)}
      />
    </ModalContainer>
  );
};

export default AddVendorModal;
