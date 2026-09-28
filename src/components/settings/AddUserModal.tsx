import { inputClass } from "@/pages/Login";

import { AdminPermissions } from "@/store/settings/users/types/userAdminTypes";
import { useCreateAdminMutation } from "@/store/settings/users/userAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ModalAction from "./ModalAction";
import ModalContainer from "./ModalContainer";

export const defaultPermissions: AdminPermissions = {
  canCreateCustomers: true,
  canUpdateCustomers: true,
  canDeleteCustomers: true,
  canViewCustomers: true,
  canCreateQuotes: true,
  canUpdateQuotes: true,
  canDeleteQuotes: true,
  canApproveQuotes: true,
  canViewQuotes: true,
  canCreateJobs: true,
  canUpdateJobs: true,
  canDeleteJobs: true,
  canViewJobs: true,
  canCreateProducts: true,
  canUpdateProducts: true,
  canDeleteProducts: true,
  canViewMockups: true,
  canCreateUsers: true,
  canUpdateUsers: true,
  canDeleteUsers: true,
  canCreateInvoices: true,
  canUpdateInvoices: true,
  canDeleteInvoices: true,
  canApproveInvoices: true,
  canTakePayment: true,
  canViewInvoices: true,
  canCreateInvoiceFees: true,
  canUpdateInvoiceFees: true,
  canDeleteInvoiceFees: true,
  canChangeInvoiceInformation: true,
  canChangeShopInformation: true,
  canCreateVendor: true,
  canUpdateVendor: true,
  canDeleteVendor: true,
  canViewReports: true,
  canViewAnalytics: true,
};

const addUserSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    password: z.string().min(9, "Minimum 9 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AddUserFormValues = z.infer<typeof addUserSchema>;

interface AddUserModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ApiErrorShape {
  data?: {
    message?: string;
    error?: string;
  };
  status?: number;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ setShowModal }) => {
  const [createAdmin, { isLoading }] = useCreateAdminMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: AddUserFormValues) => {
    setFormError(null);
    try {
      await createAdmin({
        name: values.name,
        email: values.email,
        password: values.password,
        permissions: defaultPermissions,
      }).unwrap();
      setShowModal(false);
    } catch (err) {
      const apiError = err as ApiErrorShape;
      if (apiError?.status === 409) {
        setFormError("A user with this email already exists.");
      } else {
        setFormError(
          apiError?.data?.message ?? "Failed to create user. Please try again.",
        );
      }
      console.error("Failed to create user", err);
    }
  };

  return (
    <ModalContainer
      close={() => setShowModal(false)}
      title="Add New User"
      size="max-w-md"
    >
      <form>
        <div className="p-6 space-y-4">
          {formError && (
            <div className="text-sm text-[#E7000B] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}
          <div className="space-y-2">
            <label className={inputClass.label}>Full Name</label>
            <input
              placeholder="Enter full name"
              className={inputClass.input}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-[#E7000B]">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className={inputClass.label}>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              className={inputClass.input}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-[#E7000B]">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={inputClass.label}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClass.input} pr-10`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="text-xl text-[#90A1B9] w-5 h-5" />
                ) : (
                  <Eye className="text-xl text-[#90A1B9] w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-[#62748E] mt-1">Minimum 9 characters</p>
            {errors.password && (
              <p className="text-xs text-[#E7000B]">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className={inputClass.label}>Password confirmation</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClass.input} pr-10`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="text-xl text-[#90A1B9] w-5 h-5" />
                ) : (
                  <Eye className="text-xl text-[#90A1B9] w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-[#E7000B]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </form>{" "}
      <ModalAction
        close={() => setShowModal(false)}
        create="Create User"
        isSubmitting={isLoading}
        onSubmit={handleSubmit(onSubmit)}
      />
    </ModalContainer>
  );
};

export default AddUserModal;
