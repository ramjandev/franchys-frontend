import { FiPlusCircle, FiUserPlus } from "react-icons/fi";
import ButtonWithIcon from "./ButtonWithIcon";
import CommonHeader from "./CommonHeader";

interface ManagementHeaderProps {
  title: string;
  description?: string;
  className?: string;
  buttonText?: string;
  action?: () => void;
  secondaryAction?: () => void;
  secondaryButtonText?: string;
  descriptionClassName?: string;
}

const DashboardTopSection: React.FC<ManagementHeaderProps> = ({
  title,
  description,
  className,
  buttonText,
  secondaryAction,
  secondaryButtonText,
  descriptionClassName,
  action,
}) => {
  return (
    <div
      className={`flex flex-col xl:flex-row items-start xl:items-end justify-between gap-6 pb-6   ${className} `}
    >
      <div className="space-y-1 ">
        {title && <CommonHeader size="3xl">{title}</CommonHeader>}
        {description && (
          <div className="w-full ">
            <CommonHeader size="md" className={`${descriptionClassName} `}>
              {description}
            </CommonHeader>
          </div>
        )}
      </div>

      <div className="flex gap-4.5 items-center">
        {secondaryButtonText && (
          <ButtonWithIcon
            icon={FiUserPlus}
            className=" flex justify-center  shrink-0 bg-white! text-[#314158]!"
          >
            <p onClick={secondaryAction}>{secondaryButtonText}</p>
          </ButtonWithIcon>
        )}
        {buttonText && (
          <ButtonWithIcon
            icon={FiPlusCircle}
            className="flex justify-center  shrink-0 bg-[linear-gradient(173deg,_#0D538F_10.35%,_#0E273C_118.73%)] "
          >
            <p onClick={action}>{buttonText}</p>
          </ButtonWithIcon>
        )}
      </div>
    </div>
  );
};
export default DashboardTopSection;
