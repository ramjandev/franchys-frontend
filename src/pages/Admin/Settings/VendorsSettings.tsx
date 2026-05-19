import AddVendorModal from "@/components/settings/AddVendorModal";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";

const vendorsData = [
  {
    id: 1,
    company: "TSC Apparel",
    name: "John Doe",
    email: "sales@alphabroder.com",
  },
  { id: 2, company: "SanMar", name: "Jane Smith", email: "sales@sanmar.com" },
  {
    id: 3,
    company: "S&S Activewear",
    name: "Mike Johnson",
    email: "orders@ssactivewear.com",
  },
];

const VendorsSettings = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="">
      <div className="mb-6 pb-4 border-b border-border flex flex-col md:flex-row justify-between items-start gap-5">
        <div>
          <CommonHeader size="2xl" className="font-medium!">
            Vendors
          </CommonHeader>
          <CommonHeader size="sm">
            Manage your suppliers and vendor contacts
          </CommonHeader>
        </div>
        <CommonButton variant="gradient" onClick={() => setShowModal(true)}>
          <GoPlusCircle /> New Vendor
        </CommonButton>
      </div>

      <div className="bg-white rounded-xl border border-[#F1F5F9] overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#314158] bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/3">Company</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {vendorsData.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-[#0077FF] font-medium cursor-pointer hover:underline">
                    {vendor.company}
                  </td>
                  <td className="px-6 py-4 text-[#314158]">{vendor.name}</td>
                  <td className="px-6 py-4 text-[#314158]">{vendor.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-skyBlue font-semibold text-xs hover:underline mr-3 cursor-pointer">
                      Edit
                    </button>
                    <button className="text-[#E7000B] font-semibold text-xs hover:underline cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <AddVendorModal setShowModal={setShowModal} />}
    </div>
  );
};

export default VendorsSettings;
