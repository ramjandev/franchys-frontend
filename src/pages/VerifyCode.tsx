import ButtonWithLoading from "@/components/shared/ButtonWithLoading";
import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useForgotPasswordMutation,
  useVerifyMutation,
} from "@/store/Auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import logo from "../assets/images/logo.png";

const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Verification code is required")
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

const RESEND_SECONDS = 60;

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email;

  const [verify, { isLoading }] = useVerifyMutation();
  const [forgotPassword, { isLoading: isResending }] =
    useForgotPasswordMutation();

  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const onSubmit = async (data: VerifyCodeFormData) => {
    try {
      if (!email) return;
      const res = await verify({ email, code: data.code }).unwrap();
      toast.success(res?.message || "Code verified successfully");
      navigate("/reset-password", { state: { token: res.data.resetToken } });
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid or expired code");
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !email) return;

    try {
      await forgotPassword({ email }).unwrap();
      setResendTimer(RESEND_SECONDS);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[linear-gradient(135deg,_#EFF6FF_0%,_#FAF5FF_50%,_#FDF2F8_100%)]">
      <div className="w-full max-w-112.5 flex flex-col items-center gap-6">
        {/* Back Button */}
        <div className="w-full">
          <Link
            to="/forgot-password"
            className="flex items-center gap-2 text-sm text-[#314158] font-medium hover:text-[#155DFC] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Logo */}
        <div className="w-41 h-31.5">
          <img className="w-full h-full object-cover" src={logo} alt="logo" />
        </div>

        {/* Header */}
        <div className="space-y-2 flex flex-col items-center justify-center text-center">
          <CommonHeader size="3xl">Enter Verification Code</CommonHeader>

          <CommonHeader size="md">
            We sent a verification code to your email
          </CommonHeader>
        </div>

        {/* Card */}
        <CardContainer size="3xl">
          <form
            className="space-y-6 flex flex-col items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full text-center">
              <p className="text-sm text-[#314158] font-semibold mb-5">
                Enter 6-Digit Code
              </p>

              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup className="w-full justify-center gap-2 sm:gap-3">
                      <InputOTPSlot
                        index={0}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-md border border-border text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-md border border-border text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-md border border-border text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-md border border-border text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-md border border-border text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-md border border-border text-lg font-semibold"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />

              {errors.code ? (
                <p className="text-xs text-red-500 mt-4">
                  {errors.code.message}
                </p>
              ) : (
                <p className="text-xs text-[#90A1B9] mt-4">
                  Code expires in 10 minutes
                </p>
              )}
            </div>

            <CommonButton
              className="w-full!"
              type="submit"
              isLoading={isLoading}
              loadingText="Processing..."
            >
              <CheckCircle2 className="text-lg" />
              Verify Code
            </CommonButton>

            <div className="text-center">
              <p className="text-sm text-[#314158] mb-1">
                Didn&apos;t receive the code?
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || isResending}
                className="text-sm text-[#155DFC] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
              >
                {isResending ? <ButtonWithLoading /> : "Resend Code"}
              </button>

              {resendTimer > 0 && (
                <p className="text-xs text-[#90A1B9] mt-2">
                  Resend available in{" "}
                  <span className="text-[#155DFC] font-medium">
                    {resendTimer}s
                  </span>
                </p>
              )}
            </div>
          </form>
        </CardContainer>
      </div>
    </div>
  );
};

export default VerifyCode;
