import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const vendorsData = [
  { id: 1, company: "TSC Apparel", name: "John Doe", email: "sales@alphabroder.com" },
  { id: 2, company: "SanMar", name: "Jane Smith", email: "sales@sanmar.com" },
  { id: 3, company: "S&S Activewear", name: "Mike Johnson", email: "orders@ssactivewear.com" },
];

const VendorsSettings = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8 relative">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-4 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-1">
            Vendors
          </h2>
          <p className="text-sm text-[#5C7899]">
            Manage your suppliers and vendor contacts
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="h-10 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white rounded-lg gap-2 font-medium shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Vendor
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#F1F5F9] overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#5C7899] bg-[#F8FAFC] border-b border-[#F1F5F9]">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/3">Company</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {vendorsData.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-[#0077FF] font-medium cursor-pointer hover:underline">{vendor.company}</td>
                  <td className="px-6 py-4 text-[#5C7899]">{vendor.name}</td>
                  <td className="px-6 py-4 text-[#5C7899]">{vendor.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#0077FF] font-semibold text-xs hover:underline mr-3">Edit</button>
                    <button className="text-[#E11D48] font-semibold text-xs hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vendor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-[#0077FF] px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Add New Vendor</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#111827] mb-4">General</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">Company</label>
                    <input type="text" placeholder="Company name" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">Name</label>
                    <input type="text" placeholder="Contact name" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">Email</label>
                    <input type="text" placeholder="john@example.com, tim@email.com" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">Phone</label>
                    <input type="text" placeholder="Phone number" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">Fax</label>
                    <input type="text" placeholder="Fax number" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">Account number</label>
                    <input type="text" placeholder="Account number" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#111827] mb-4">Address</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">Address</label>
                    <input type="text" placeholder="Street address" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">Address</label>
                    <input type="text" placeholder="Apartment, suite, etc." className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">City</label>
                    <input type="text" placeholder="City" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">State</label>
                    <input type="text" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">Country</label>
                    <input type="text" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="sm:w-32 text-xs font-semibold text-[#111827]">Zip</label>
                    <input type="text" placeholder="Zip code" className="flex-1 h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm outline-none focus:border-[#0077FF]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F8FAFC] px-6 py-4 flex items-center justify-end gap-3 border-t border-[#F1F5F9] sticky bottom-0">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-[#5C7899] hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#053F7A] text-white text-sm font-medium rounded-lg hover:bg-[#042f5a] transition-colors">
                Create Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsSettings;
