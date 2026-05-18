import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { inputClass } from "./Login";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[linear-gradient(135deg,_#EFF6FF_0%,_#FAF5FF_50%,_#FDF2F8_100%)]">
      <div className="w-full max-w-112.5 flex flex-col items-center gap-6">
        <div className="w-full">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-[#314158] font-medium hover:text-[#155DFC] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <div className="w-41 h-31.5">
          <img className="w-full h-full object-cover" src={logo} alt="logo" />
        </div>

        <div className="space-y-2 flex flex-col items-center justify-center text-center">
          <CommonHeader size="3xl">Forgot Password?</CommonHeader>

          <CommonHeader size="md">
            Enter your email and we'll send you a verification code
          </CommonHeader>
        </div>

        <CardContainer size="3xl">
          <form className="space-y-6">
            <div>
              <label className={inputClass.label}>Email Address</label>

              <div className="flex items-center pl-3 gap-2 border border-border bg-white rounded-md outline-none text-text text-base w-full focus-within:border-primary">
                <Mail className="text-xl text-[#90A1B9]" />

                <input
                  className="py-3.5 w-full outline-none text-text text-base placeholder:text-[#90A1B9]"
                  type="email"
                  placeholder="you@company.com"
                />
              </div>

              <p className="text-xs text-[#90A1B9] mt-2">
                We'll send a verification code to this email address
              </p>
            </div>

            <CommonButton variant="gradient" className="w-full">
              <Send className="text-lg" />
              Send Verification Code
            </CommonButton>

            <div className="text-center">
              <p className="text-sm text-[#314158]">
                Remember your password?{" "}
                <Link
                  to="/"
                  className="text-[#155DFC] font-medium hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </CardContainer>
      </div>
    </div>
  );
};

export default ForgotPassword;
