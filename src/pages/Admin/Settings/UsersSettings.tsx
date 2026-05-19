import AddUserModal from "@/components/settings/AddUserModal";
import CheckboxField from "@/components/shared/CheckboxField";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";

const permissionsList = [
  "Can view customers",
  "Can add/edit customers",
  "Can delete customers",
  "Can view quotes",
  "Can create/edit quotes",
  "Can delete quotes",
  "Can approve quotes",
  "Can view jobs",
  "Can create/edit jobs",
  "Can delete jobs",
  "Can view invoices",
  "Can create/edit invoices",
  "Can delete invoices",
  "Can take payments",
  "Can view reports",
  "Can view analytics",
  "Can manage users",
  "Can manage settings",
  "Can manage vendors",
  "Can view mockups",
  "Can create/edit mockups",
];

const usersData = [
  {
    id: 1,
    role: "Administrator",
    color: "bg-[#D97706]",
    image: profile,
    initials: "A",
    permissions: permissionsList.map((p) => ({ name: p, checked: true })),
  },
  {
    id: 2,
    role: "Craig Vaccaro",
    color: "bg-[#7E22CE]",
    initials: "S",
    permissions: permissionsList.map((p) => ({
      name: p,
      checked: p.includes("view") || p.includes("create"),
    })),
  },
  {
    id: 3,
    role: "Makenna Korsgaard",
    color: "bg-[#1E293B]",
    initials: "V",
    permissions: permissionsList.map((p) => ({ name: p, checked: false })),
  },
];

import profile from "@/assets/images/profile.png";
const UsersSettings = () => {
  const [showModal, setShowModal] = useState(false);

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
        <CommonButton variant="gradient" onClick={() => setShowModal(true)}>
          <GoPlusCircle /> Add User
        </CommonButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
        {usersData.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl  border border-border overflow-hidden flex flex-col "
          >
            <div
              className={`${user.color} px-4 py-3 flex items-center gap-3 text-white`}
            >
              <div className="w-10 h-10 ">
                {user.image ? (
                  <img
                    src={user.image}
                    className="w-full h-full rounded-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                    {user.initials}
                  </div>
                )}
              </div>

              <CommonHeader size="2xl" className="text-white!">
                {user.role}
              </CommonHeader>
            </div>

            <div className="p-6 flex-1 ">
              <CommonHeader
                size="sm"
                className="text-[#0F172B]! font-bold! mb-4"
              >
                Permissions
              </CommonHeader>
              <div className="space-y-2">
                {user.permissions.map((perm, idx) => (
                  <CheckboxField
                    key={idx}
                    label={perm.name}
                    labelClassName={` text-[#314158]! font-medium! `}
                  />
                ))}
              </div>
              <CommonButton variant="gradient" className="mt-6">
                Save
              </CommonButton>
            </div>
          </div>
        ))}
      </div>

      {showModal && <AddUserModal setShowModal={setShowModal} />}
    </div>
  );
};

export default UsersSettings;
