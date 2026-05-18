import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

const permissionsList = [
  "Can view customers", "Can add/edit customers", "Can delete customers",
  "Can view quotes", "Can create/edit quotes", "Can delete quotes", "Can approve quotes",
  "Can view jobs", "Can create/edit jobs", "Can delete jobs",
  "Can view invoices", "Can create/edit invoices", "Can delete invoices", "Can take payments",
  "Can view reports", "Can view analytics", "Can manage users", "Can manage settings", "Can manage vendors",
  "Can view mockups", "Can create/edit mockups"
];

const usersData = [
  { id: 1, role: "Administrator", color: "bg-[#D97706]", initials: "A", 
    permissions: permissionsList.map(p => ({ name: p, checked: true })) 
  },
  { id: 2, role: "Craig Vaccaro", color: "bg-[#7E22CE]", initials: "S", 
    permissions: permissionsList.map(p => ({ name: p, checked: p.includes("view") || p.includes("create") })) 
  },
  { id: 3, role: "Makenna Korsgaard", color: "bg-[#1E293B]", initials: "V", 
    permissions: permissionsList.map(p => ({ name: p, checked: false })) 
  },
];

const UsersSettings = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8 relative">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-4 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-1">
            Users
          </h2>
          <p className="text-sm text-[#5C7899]">
            Manage access control and user permissions. Click on a checkbox to change what actions a user can perform.
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="h-10 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white rounded-lg gap-2 font-medium shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {usersData.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9] overflow-hidden flex flex-col h-[600px]">
            <div className={`${user.color} px-4 py-3 flex items-center gap-3 text-white`}>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                {user.initials}
              </div>
              <h3 className="font-bold text-lg">{user.role}</h3>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              <h4 className="text-xs font-bold text-[#111827] mb-3">Permissions</h4>
              <div className="space-y-2">
                {user.permissions.map((perm, idx) => (
                  <label key={idx} className="flex items-start gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      defaultChecked={perm.checked}
                      className="mt-0.5 rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" 
                    />
                    <span className="text-xs font-medium text-[#5C7899] group-hover:text-[#111827] transition-colors leading-tight">
                      {perm.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-[#F1F5F9] bg-[#F8FAFC]">
              <Button className="h-8 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white text-xs rounded-lg">
                Save
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#0077FF] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">New Employee</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111827]">Full Name</label>
                <Input placeholder="Enter full name" className="h-10 border-[#E6EBF2]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111827]">Email</label>
                <Input placeholder="email@example.com" className="h-10 border-[#E6EBF2]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111827]">Phone</label>
                <Input placeholder="(555) 123-4567" className="h-10 border-[#E6EBF2]" />
              </div>
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-[#111827]">Password</label>
                <Input type="password" placeholder="••••••••" className="h-10 border-[#E6EBF2]" />
                <p className="text-[10px] text-[#A0B0C0]">Minimum 9 characters</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111827]">Password confirmation</label>
                <Input type="password" placeholder="••••••••" className="h-10 border-[#E6EBF2]" />
              </div>
            </div>

            <div className="bg-[#F8FAFC] px-6 py-4 flex items-center justify-center gap-3 border-t border-[#F1F5F9]">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-[#5C7899] hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#053F7A] text-white text-sm font-medium rounded-lg hover:bg-[#042f5a] transition-colors">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersSettings;
