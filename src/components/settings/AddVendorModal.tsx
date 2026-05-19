import { inputClass } from "@/pages/Login";
import CommonHeader from "../shared/CommonHeader";
import ModalAction from "./ModalAction";
import ModalContainer from "./ModalContainer";

interface AddVendorModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({ setShowModal }) => {
  return (
    <ModalContainer
      close={() => setShowModal(false)}
      title="Add New Vendor"
      size="max-w-3xl"
    >
      <div className="p-6 space-y-6">
        <div>
          <CommonHeader size="lg" className="border-b border-border pb-3 mb-4">
            General
          </CommonHeader>
          <div className="space-y-4">
            {[
              { label: "Company", placeholder: "Company name" },
              { label: "Name", placeholder: "Contact name" },
              {
                label: "Email",
                placeholder: "john@example.com, tim@email.com",
                type: "email",
              },
              { label: "Phone", placeholder: "Phone number", type: "tel" },
              { label: "Fax", placeholder: "Fax number" },
              { label: "Account number", placeholder: "Account number" },
            ].map(({ label, placeholder, type = "text" }) => (
              <div key={label} className="grid grid-cols-[180px_1fr] gap-4">
                <label className={`${inputClass.label} text-right`}>
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className={inputClass.input}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div>
          <CommonHeader size="lg" className="border-b border-border pb-3 mb-4">
            Address
          </CommonHeader>{" "}
          <div className="space-y-4">
            {[
              { label: "Address", placeholder: "Street address" },
              { label: "Address 2", placeholder: "Apartment, suite, etc." },
              { label: "City", placeholder: "City" },
              { label: "State", placeholder: "" },
              { label: "Country", placeholder: "" },
              { label: "Zip", placeholder: "Zip code" },
            ].map(({ label, placeholder }) => (
              <div key={label} className="grid grid-cols-[180px_1fr] gap-4">
                <label className={`${inputClass.label} text-right`}>
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  className={inputClass.input}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModalAction close={() => setShowModal(false)} create="Create Vendor" />
    </ModalContainer>
  );
};

export default AddVendorModal;
