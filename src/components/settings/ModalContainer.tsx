import { X } from "lucide-react";
import CommonHeader from "../shared/CommonHeader";

interface PriceMatrixModalProps {
  close: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: string;
}

const ModalContainer: React.FC<PriceMatrixModalProps> = ({
  close,
  title = "Create the Pricing Matrix",
  size = "max-w-lg ",
  description,
  children,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className={`bg-white w-full ${size} max-h-[90vh] flex flex-col z-20 rounded-2xl overflow-hidden shadow-2xl`}
      >
        <div className="bg-gradient-to-r from-[#155DFC] z-30 to-[#1447E6] p-4 flex items-center justify-between rounded-t-2xl shrink-0">
          <div>
            <CommonHeader size="xl" className="text-white!">
              {title}
            </CommonHeader>
            {description && (
              <CommonHeader size="xs" className="text-white!">
                {description}
              </CommonHeader>
            )}
          </div>
          <X
            size={20}
            onClick={close}
            className="text-white cursor-pointer hover:opacity-80 transition-opacity shrink-0 ml-4"
          />
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalContainer;
