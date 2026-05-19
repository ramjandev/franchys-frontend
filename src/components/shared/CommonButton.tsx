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
    "px-4 py-2.5  rounded-md font-medium transition text-sm   cursor-pointer whitespace-nowrap flex items-center justify-center gap-1  disabled:cursor-not-allowed    ";
  const variantClasses = {
    primary: "bg-white border border-[#CAD5E2] text-[#314158] ",
    secondary: "bg-white border border-border text-text",
    gradient:
      "rounded-[8.155px] bg-[linear-gradient(173deg,_#0D538F_10.35%,_#0E273C_118.73%)] text-white",
    blue: "bg-[#155DFC] text-white text-sm font-medium  ",
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
