import type { RootState } from "@/store/store";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { FiUserPlus } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonWithIcon from "./ButtonWithIcon";
import CommonHeader from "./CommonHeader";

interface ManagementHeaderProps {
  title: string;
  description?: string;
  className?: string;
  buttonOne?: string;
  actionOne?: () => void;
  buttonTwo?: string;
  actionTwo?: () => void;
  buttonThree?: string;
  actionThree?: () => void;
  descriptionClassName?: string;
  backButton?: boolean;
}

const DashboardTopSection: React.FC<ManagementHeaderProps> = ({
  title,
  description,
  className,
  buttonOne,
  actionOne,
  buttonTwo,
  actionTwo,
  buttonThree,
  actionThree,
  descriptionClassName,
  backButton = false,
}) => {
  const { privacy } = useSelector((s: RootState) => s.design);
  const navigate = useNavigate();
  return (
    <div
      className={`flex flex-col xl:flex-row items-start xl:items-end justify-between gap-6 pb-0 sm:pb-6   ${className} `}
    >
      <div className="space-y-1 flex gap-3 ">
        {backButton && (
          <p onClick={() => navigate(-1)} className="mt-3 cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-[#5C7899] hover:text-[#111827]" />
          </p>
        )}
        <div>
          {title && <CommonHeader size="3xl">{title}</CommonHeader>}

          {description && (
            <div className="w-full ">
              <CommonHeader size="md" className={`${descriptionClassName} `}>
                {description}
              </CommonHeader>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4.5 items-center w-full sm:w-auto">
        {buttonThree && (
          <ButtonWithIcon
            icon={privacy ? EyeOff : Eye}
            className="w-full! sm:w-auto! flex justify-center  shrink-0 bg-white! text-[#155DFC]!"
            onClick={actionThree}
          >
            <p>{buttonThree}</p>
          </ButtonWithIcon>
        )}

        {buttonTwo && (
          <ButtonWithIcon
            icon={FiUserPlus}
            className="w-full! sm:w-auto! flex justify-center  shrink-0 bg-white! text-[#314158]!"
            onClick={actionTwo}
          >
            <p>{buttonTwo}</p>
          </ButtonWithIcon>
        )}

        {buttonOne && (
          <ButtonWithIcon
            icon={GoPlusCircle}
            className="w-full! sm:w-auto! flex justify-center  shrink-0 bg-[linear-gradient(173deg,_#0D538F_10.35%,_#0E273C_118.73%)] "
            onClick={actionOne}
          >
            <p>{buttonOne}</p>
          </ButtonWithIcon>
        )}
      </div>
    </div>
  );
};
export default DashboardTopSection;
