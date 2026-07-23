import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { useChangePasswordMutation } from "@/store/Auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiKeyBold } from "react-icons/pi";
import { toast } from "sonner";
import { z } from "zod";
import { inputClass } from "./Login";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
      console.error("Change password failed:", error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="space-y-2">
        <CommonHeader size="3xl">Change Password</CommonHeader>
        <CommonHeader size="md">Update your account password</CommonHeader>
      </div>

      <CardContainer size="3xl">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className={inputClass.label}>Current Password</label>

            <div className="flex items-center pl-3 gap-2 border border-border bg-white rounded-md outline-none text-text text-base w-full">
              <Lock className="text-xl text-[#90A1B9]" />

              <input
                {...register("oldPassword")}
                className="py-3.5 w-full outline-none text-text text-base placeholder:text-[#90A1B9]"
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="pr-3 cursor-pointer"
              >
                {showOldPassword ? (
                  <EyeOff className="text-xl text-[#90A1B9]" />
                ) : (
                  <Eye className="text-xl text-[#90A1B9]" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p className={inputClass.error}>{errors.oldPassword.message}</p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>New Password</label>

            <div className="flex items-center pl-3 gap-2 border border-border bg-white rounded-md outline-none text-text text-base w-full">
              <Lock className="text-xl text-[#90A1B9]" />

              <input
                {...register("newPassword")}
                className="py-3.5 w-full outline-none text-text text-base placeholder:text-[#90A1B9]"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="pr-3 cursor-pointer"
              >
                {showNewPassword ? (
                  <EyeOff className="text-xl text-[#90A1B9]" />
                ) : (
                  <Eye className="text-xl text-[#90A1B9]" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className={inputClass.error}>{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>Confirm New Password</label>

            <div className="flex items-center pl-3 gap-2 border border-border bg-white rounded-md outline-none text-text text-base w-full">
              <Lock className="text-xl text-[#90A1B9]" />

              <input
                {...register("confirmPassword")}
                className="py-3.5 w-full outline-none text-text text-base placeholder:text-[#90A1B9]"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="pr-3 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="text-xl text-[#90A1B9]" />
                ) : (
                  <Eye className="text-xl text-[#90A1B9]" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={inputClass.error}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <CommonButton
            type="submit"
            className="w-full!"
            isLoading={isLoading}
            loadingText="Changing..."
          >
            <PiKeyBold className="text-xl" />
            Change Password
          </CommonButton>
        </form>
      </CardContainer>
    </div>
  );
};

export default ChangePassword;
