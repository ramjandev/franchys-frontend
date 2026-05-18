import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

const VerifyCode = () => {
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
          <div className="space-y-6 flex flex-col items-center">
            <div className="w-full text-center">
              <p className="text-sm text-[#314158] font-semibold mb-5">
                Enter 6-Digit Code
              </p>

              <InputOTP maxLength={6}>
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

              <p className="text-xs text-[#90A1B9] mt-4">
                Code expires in 10 minutes
              </p>
            </div>

            <CommonButton variant="gradient" className="w-full">
              <CheckCircle2 className="text-lg" />
              Verify Code
            </CommonButton>

            <div className="text-center">
              <p className="text-sm text-[#314158] mb-1">
                Didn&apos;t receive the code?
              </p>

              <button
                type="button"
                className="text-sm text-[#155DFC] font-medium hover:underline"
              >
                Resend Code
              </button>

              <p className="text-xs text-[#90A1B9] mt-2">
                Resend available in{" "}
                <span className="text-[#155DFC] font-medium">53s</span>
              </p>
            </div>
          </div>
        </CardContainer>
      </div>
    </div>
  );
};

export default VerifyCode;
