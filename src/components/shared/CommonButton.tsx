import React, { type ReactNode } from "react";

interface CommonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "gradient" | "blue";
  type?: "button" | "submit" | "reset";
}

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) => {
  const baseClasses =
    "px-4  py-2.5 rounded-md font-medium transition text-sm sm:text-base  cursor-pointer whitespace-nowrap flex items-center justify-center gap-1  disabled:cursor-not-allowed    ";
  const variantClasses = {
    primary: "bg-white border border-[#CAD5E2] text-[#314158] ",
    secondary: "bg-white border border-border text-text",
    gradient:
      "bg-[linear-gradient(178deg,_#0D538F_11.61%,_#0E273C_116.54%)] text-white text-lg px-6 py-4 rounded-3xl",
    blue: "bg-[#155DFC] text-white text-sm font-medium ",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CommonButton;
