import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { PiSignInBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

export const inputClass = {
  form: "space-y-6 w-full border border-border rounded-md p-4 sm:p-6 bg-white ",
  label: "block text-sm text-[#314158] mb-2 font-semibold",
  input:
    "w-full border border-border bg-white rounded-md p-3 outline-none text-text text-base placeholder:text-[#90A1B9]",
  error: "text-red-500 text-sm mt-1",
};
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center   p-4 bg-[linear-gradient(135deg,_#EFF6FF_0%,_#FAF5FF_50%,_#FDF2F8_100%)]">
      <div className="w-full max-w-112.5 flex flex-col items-center gap-6">
        <div className="w-41 h-31.5">
          <img className="w-full h-full object-cover " src={logo} alt="logo" />
        </div>
        <div className=" space-y-2 flex flex-col items-center justify-center">
          <CommonHeader size="3xl" className="">
            Sign In
          </CommonHeader>
          <CommonHeader size="md">Sign in to your account</CommonHeader>
        </div>

        <CardContainer className="" size="3xl">
          <form className="space-y-6">
            <div>
              <label className={inputClass.label}>Email Address</label>
              <div className="flex items-center pl-3 gap-2 border border-border bg-white rounded-md  outline-none text-text text-base w-full">
                <Mail className="text-xl text-[#90A1B9]" />
                <input
                  className="py-3.5 w-full outline-none text-text text-base placeholder:text-[#90A1B9]"
                  type="email"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label className={inputClass.label}>Password</label>

              <div className="flex items-center pl-3 gap-2 border border-border bg-white rounded-md outline-none text-text text-base w-full">
                <Lock className="text-xl text-[#90A1B9]" />

                <input
                  className="py-3.5 w-full outline-none text-text text-base placeholder:text-[#90A1B9]"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-[#E6EBF2] rounded-[4px]"
                />
                <label
                  htmlFor="remember"
                  className={
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#314158]"
                  }
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-[#155DFC] font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <CommonButton variant="gradient" className="w-full">
              <PiSignInBold className="text-xl" />
              Sign In
            </CommonButton>
          </form>
        </CardContainer>
      </div>
    </div>
  );
};

export default Login;
