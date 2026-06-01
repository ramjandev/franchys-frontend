import CommonButton from "../shared/CommonButton";

interface ModalActionProps {
  close: () => void;
  onSubmit?: () => void;
  cancel?: string;
  create?: string;
}
const ModalAction: React.FC<ModalActionProps> = ({
  close,
  cancel = "Cancel",
  create = "Create",
  onSubmit,
}) => {
  return (
    <div className="bg-[#F8FAFC] px-6 py-4 flex items-center justify-end gap-3">
      <CommonButton onClick={close}>{cancel}</CommonButton>
      <CommonButton onClick={onSubmit} variant="gradient">
        {create}
      </CommonButton>
    </div>
  );
};

export default ModalAction;
