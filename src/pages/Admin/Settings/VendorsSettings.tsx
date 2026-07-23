import AddVendorModal from "@/components/settings/AddVendorModal";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import IconActionButton from "@/components/shared/IconActionButton";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import { Vendor } from "@/store/settings/vendors/types/vendorTypes";
import {
  useDeleteVendorMutation,
  useGetVendorsQuery,
} from "@/store/settings/vendors/vendorAPI";

import { useState } from "react";

const VendorsSettings = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(
    undefined,
  );

  const { data, isLoading } = useGetVendorsQuery({ page: 1, limit: 10 });
  const [deleteVendor, { originalArgs }] = useDeleteVendorMutation();

  const vendors = data?.data ?? [];

  const openAddModal = () => {
    setEditingVendor(undefined);
    setShowModal(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowModal(true);
  };

  const handleDelete = async (vendorId: string) => {
    try {
      await deleteVendor(vendorId).unwrap();
    } catch (err) {
      console.error("Failed to delete vendor", err);
    }
  };

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
        <CommonButton showDefaultIcon onClick={openAddModal}>
          New Vendor
        </CommonButton>
      </div>

      <LoadingStatus isLoading={isLoading} items={vendors} itemName="vendors" />

      {!isLoading && vendors.length > 0 && (
        <div className="bg-white rounded-xl border border-[#F1F5F9] overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#314158] bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4 font-semibold w-1/3">Company</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {vendors.map((vendor) => (
                  <tr
                    key={vendor.vendorId}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-[#0077FF] font-medium cursor-pointer hover:underline">
                      {vendor.companyName}
                    </td>
                    <td className="px-6 py-4 text-[#314158]">
                      {vendor.contactName}
                    </td>
                    <td className="px-6 py-4 text-[#314158]">{vendor.email}</td>
                    <td className="px-6 py-4 text-right">
                      <IconActionButton
                        title="Edit"
                        onClick={() => openEditModal(vendor)}
                      />

                      <IconActionButton
                        title="Delete"
                        variant="delete"
                        onClick={() => handleDelete(vendor.vendorId)}
                        isLoading={originalArgs === vendor.vendorId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showModal && (
        <AddVendorModal setShowModal={setShowModal} vendor={editingVendor} />
      )}
    </div>
  );
};

export default VendorsSettings;
