import CommonButton from "../shared/CommonButton";

interface ModalActionProps {
  close: () => void;
  cancel?: string;
  create?: string;
}
const ModalAction: React.FC<ModalActionProps> = ({
  close,
  cancel = "Cancel",
  create = "Create",
}) => {
  return (
    <div className="bg-[#F8FAFC] px-6 py-4 flex items-center justify-end gap-3">
      <CommonButton onClick={close}>{cancel}</CommonButton>
      <CommonButton variant="gradient">{create}</CommonButton>
    </div>
  );
};

export default ModalAction;
