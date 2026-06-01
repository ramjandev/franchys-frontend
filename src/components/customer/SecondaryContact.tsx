import { inputClass } from "@/pages/Login";

interface SecondaryContactProps {
  onRemove: () => void;
}

const SecondaryContact: React.FC<SecondaryContactProps> = ({ onRemove }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full mt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-[#111827]">
          Secondary Contact{" "}
          <span className="font-normal text-[#5C7899]">(Optional)</span>
        </h2>
        <button
          onClick={onRemove}
          className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors duration-150 cursor-pointer"
        >
          Remove
        </button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={inputClass.label}>First Name</label>
          <input placeholder="Jane" className={inputClass.input} />
        </div>

        <div className="space-y-2">
          <label className={inputClass.label}>Last Name</label>
          <input placeholder="Doe" className={inputClass.input} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className={inputClass.label}>Email Address</label>
          <input
            placeholder="jane.doe@example.com"
            type="email"
            className={inputClass.input}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className={inputClass.label}>Phone Number</label>
          <input
            placeholder="(555) 987-6543"
            type="tel"
            className={inputClass.input}
          />
        </div>
      </div>
    </div>
  );
};

export default SecondaryContact;
