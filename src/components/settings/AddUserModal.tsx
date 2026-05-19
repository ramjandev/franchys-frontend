import { inputClass } from "@/pages/Login";
import ModalAction from "./ModalAction";
import ModalContainer from "./ModalContainer";

interface inputProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUserModal: React.FC<inputProps> = ({ setShowModal }) => {
  return (
    <ModalContainer
      close={() => setShowModal(false)}
      title="Add New User"
      size="max-w-md"
    >
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <label className={inputClass.label}>Full Name</label>
          <input placeholder="Enter full name" className={inputClass.input} />
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>Email</label>
          <input
            type="email"
            placeholder="email@example.com"
            className={inputClass.input}
          />
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>Phone</label>
          <input placeholder="(555) 123-4567" className={inputClass.input} />
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className={inputClass.input}
          />
          <p className="text-xs text-[#62748E] mt-1">Minimum 9 characters</p>
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>Password confirmation</label>
          <input
            type="password"
            placeholder="••••••••"
            className={inputClass.input}
          />
        </div>
      </div>
      <ModalAction close={() => setShowModal(false)} create="Create User" />
    </ModalContainer>
  );
};

export default AddUserModal;
