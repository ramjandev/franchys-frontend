import AddUserModal, {
  defaultPermissions,
} from "@/components/settings/AddUserModal";
import CheckboxField from "@/components/shared/CheckboxField";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import DashboardCardSkeleton from "@/components/shared/loading/DashboardCardSkeleton";
import EmptyState from "@/components/shared/loading/EmptyState";
import { loadingArray } from "@/lib/utils";
import {
  AdminPermissions,
  AdminUser,
} from "@/store/settings/users/types/userAdminTypes";
import {
  useBanAdminMutation,
  useDeleteAdminMutation,
  useGetAdminQuery,
  useRestoreAdminMutation,
  useUpdateAdminMutation,
} from "@/store/settings/users/userAPI";

import { RotateCcw, ShieldBan, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const permissionUiConfig: {
  label: string;
  keys: (keyof AdminPermissions)[];
}[] = [
  { label: "Can view customers", keys: [] },
  {
    label: "Can add/edit customers",
    keys: ["canCreateCustomers", "canUpdateCustomers"],
  },
  { label: "Can delete customers", keys: ["canDeleteCustomers"] },
  { label: "Can view quotes", keys: [] },
  {
    label: "Can create/edit quotes",
    keys: ["canCreateQuotes", "canUpdateQuotes"],
  },
  { label: "Can delete quotes", keys: ["canDeleteQuotes"] },
  { label: "Can approve quotes", keys: ["canApproveQuotes"] },
  { label: "Can view jobs", keys: [] },
  { label: "Can create/edit jobs", keys: ["canCreateJobs", "canUpdateJobs"] },
  { label: "Can delete jobs", keys: ["canDeleteJobs"] },
  { label: "Can view invoices", keys: [] },
  {
    label: "Can create/edit invoices",
    keys: ["canCreateInvoices", "canUpdateInvoices"],
  },
  { label: "Can delete invoices", keys: ["canDeleteInvoices"] },
  { label: "Can take payments", keys: ["canTakePayment"] },
  { label: "Can view reports", keys: [] },
  { label: "Can view analytics", keys: [] },
  {
    label: "Can manage users",
    keys: ["canCreateUsers", "canUpdateUsers", "canDeleteUsers"],
  },
  {
    label: "Can manage settings",
    keys: ["canChangeShopInformation", "canChangeInvoiceInformation"],
  },
  {
    label: "Can manage vendors",
    keys: ["canCreateVendor", "canUpdateVendor", "canDeleteVendor"],
  },
  { label: "Can view mockups", keys: [] },
  {
    label: "Can create/edit mockups",
    keys: ["canCreateProducts", "canUpdateProducts"],
  },
];

const cardColors = [
  "bg-[#D97706]",
  "bg-[#7E22CE]",
  "bg-[#1E293B]",
  "bg-[#0F766E]",
  "bg-[#B91C1C]",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

interface UserPermissionCardProps {
  admin: AdminUser;
  colorIndex: number;
}

const UserPermissionCard: React.FC<UserPermissionCardProps> = ({
  admin,
  colorIndex,
}) => {
  const [updateAdmin, { isLoading: isSaving }] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();
  const [restoreAdmin, { isLoading: isRestoring }] = useRestoreAdminMutation();
  const [banAdmin, { isLoading: isBanning }] = useBanAdminMutation();

  const [permissions, setPermissions] = useState<AdminPermissions>(
    admin.permissions ?? defaultPermissions,
  );

  // keep local checkbox state in sync if the admin record refetches/changes
  useEffect(() => {
    setPermissions(admin.permissions ?? defaultPermissions);
  }, [admin.permissions]);

  const togglePermission = (keys: (keyof AdminPermissions)[]) => {
    if (keys.length === 0) return; // no backend field to toggle
    const currentlyAllChecked = keys.every((key) => permissions[key]);
    setPermissions((prev) => {
      const next = { ...prev };
      keys.forEach((key) => {
        next[key] = !currentlyAllChecked;
      });
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await updateAdmin({
        id: admin.userId,
        data: { permissions },
      }).unwrap();
    } catch (err) {
      console.error("Failed to update permissions", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAdmin(admin.userId).unwrap();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreAdmin(admin.userId).unwrap();
    } catch (err) {
      console.error("Failed to restore user", err);
    }
  };

  const handleBan = async () => {
    try {
      await banAdmin(admin.userId).unwrap();
    } catch (err) {
      console.error("Failed to ban user", err);
    }
  };

  return (
    <div className="bg-white rounded-xl  border border-border overflow-hidden flex flex-col ">
      <div
        className={`${cardColors[colorIndex % cardColors.length]} px-4 py-3 flex items-center justify-between gap-3 text-white`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0">
            {admin.profileImage ? (
              <img
                src={admin.profileImage}
                className="w-full h-full rounded-full object-cover"
                alt=""
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                {getInitials(admin.name)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <CommonHeader size="2xl" className="text-white! truncate">
              {admin.name}
            </CommonHeader>
            {admin.isDeleted && (
              <span className="text-xs text-white/80">Deleted</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {admin.status === "SUSPEND" ? (
            <button
              type="button"
              title="Restore user"
              onClick={handleRestore}
              disabled={isRestoring}
              className="p-1.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw size={16} />
            </button>
          ) : (
            <>
              <button
                type="button"
                title="Ban / suspend user"
                onClick={handleBan}
                disabled={isBanning}
                className="p-1.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ShieldBan size={16} />
              </button>
              <button
                type="button"
                title="Delete user"
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 ">
        <CommonHeader size="sm" className="text-[#0F172B]! font-bold! mb-4">
          Permissions
        </CommonHeader>
        <div className="space-y-2">
          {permissionUiConfig.map((perm, idx) => (
            <CheckboxField
              key={idx}
              label={perm.label}
              labelClassName={` text-[#314158]! font-medium! `}
              checked={
                perm.keys.length > 0
                  ? perm.keys.every((key) => permissions[key])
                  : false
              }
              onChange={() => togglePermission(perm.keys)}
            />
          ))}
        </div>
        <CommonButton className="mt-6" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </CommonButton>
      </div>
    </div>
  );
};

const UsersSettings = () => {
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading } = useGetAdminQuery({ page: 1, limit: 20 });

  const admins = data?.data ?? [];

  return (
    <div className="">
      <div className="mb-6  flex flex-col md:flex-row justify-between items-start gap-5">
        <div>
          <CommonHeader size="2xl" className="font-medium!">
            Users
          </CommonHeader>
          <CommonHeader size="sm">
            Manage access control and user permissions. Click on a checkbox to
            change what actions a user can perform.
          </CommonHeader>
        </div>
        <CommonButton showDefaultIcon onClick={() => setShowModal(true)}>
          Add User
        </CommonButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
        {isLoading ? (
          loadingArray(4).map((_, index) => (
            <DashboardCardSkeleton key={index} />
          ))
        ) : admins.length > 0 ? (
          admins.map((admin, idx) => (
            <UserPermissionCard
              key={admin.userId}
              admin={admin}
              colorIndex={idx}
            />
          ))
        ) : (
          <div className="col-span-2 flex items-center justify-center text-sm text-gray-500">
            <EmptyState title="No users found" description="" />
          </div>
        )}
      </div>

      {showModal && <AddUserModal setShowModal={setShowModal} />}
    </div>
  );
};

export default UsersSettings;
