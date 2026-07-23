import CommonButton from "../shared/CommonButton";

interface ModalActionProps {
  close: () => void;
  cancel?: string;
  create?: string;
  isSubmitting?: boolean;
  loadingText?: string;
  onSubmit: () => void;
}

const ModalAction: React.FC<ModalActionProps> = ({
  close,
  cancel = "Cancel",
  create = "Create",
  isSubmitting = false,
  loadingText = "Loading...",
  onSubmit,
}) => {
  return (
    <div className="bg-[#F8FAFC] px-6 py-4 flex items-center justify-end gap-3">
      <CommonButton type="button" variant="ghost" onClick={close}>
        {cancel}
      </CommonButton>
      <CommonButton
        onClick={onSubmit}
        isLoading={isSubmitting}
        loadingText={loadingText}
      >
        {create}
      </CommonButton>
    </div>
  );
};

export default ModalAction;
