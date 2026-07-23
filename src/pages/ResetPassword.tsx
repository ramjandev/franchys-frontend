import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { useResetPasswordMutation } from "@/store/Auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiKeyBold } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import logo from "../assets/images/logo.png";
import { inputClass } from "./Login";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const location = useLocation();
  const token = (location.state as { token?: string })?.token;

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      if (!token) return;
      await resetPassword({
        token: token as string,
        newPassword: data.newPassword,
      }).unwrap();

      navigate("/");
    } catch (error) {
      console.error("Reset password failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center   p-4 bg-[linear-gradient(135deg,_#EFF6FF_0%,_#FAF5FF_50%,_#FDF2F8_100%)]">
      <div className="w-full max-w-112.5 flex flex-col items-center gap-6">
        <div className="w-41 h-31.5">
          <img className="w-full h-full object-cover " src={logo} alt="logo" />
        </div>
        <div className=" space-y-2 flex flex-col items-center justify-center">
          <CommonHeader size="3xl" className="">
            Reset Password
          </CommonHeader>
          <CommonHeader size="md">Enter your new password</CommonHeader>
        </div>

        <CardContainer className="" size="3xl">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className={inputClass.label}>New Password</label>

              <div className="flex items-center pl-3 gap-2 border border-border bg-white rounded-md outline-none text-text text-base w-full">
                <Lock className="text-xl text-[#90A1B9]" />

                <input
                  {...register("newPassword")}
                  className="py-3.5 w-full outline-none text-text text-base placeholder:text-[#90A1B9]"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3 cursor-pointer"
                >
                  {showPassword ? (
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
              <label className={inputClass.label}>Confirm Password</label>

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
              loadingText="Resting..."
            >
              <PiKeyBold className="text-xl" />
              Reset Password
            </CommonButton>
          </form>
        </CardContainer>
      </div>
    </div>
  );
};

export default ResetPassword;
