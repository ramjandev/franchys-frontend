import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ArrowLeft, Mail, Phone, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

const customersData = [
  {
    id: "C-1001",
    company: "Riverside Church",
    contact: "David Miller",
    email: "david@riverside.org",
    phone: "(555) 123-4567",
    orders: 12,
    totalSpent: "$14,500",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1002",
    company: "Metro Fire Department",
    contact: "Sarah Jenkins",
    email: "sjenkins@metrofire.gov",
    phone: "(555) 123-4567",
    orders: 5,
    totalSpent: "$6,100",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1003",
    company: "Lincoln High School",
    contact: "Michael Chang",
    email: "mchang@lincolnhs.edu",
    phone: "(555) 123-4567",
    orders: 8,
    totalSpent: "$2,400",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1004",
    company: "Craft Brewery Co",
    contact: "Jessica Torres",
    email: "jessica@craftbrewery.com",
    phone: "(555) 123-4567",
    orders: 3,
    totalSpent: "$540",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1005",
    company: "Summit CrossFit",
    contact: "Tom Bradley",
    email: "tom@summitcrossfit.com",
    phone: "(555) 123-4567",
    orders: 1,
    totalSpent: "$1,200",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1006",
    company: "Downtown Dental",
    contact: "David Miller",
    email: "echen@downtowndental.com",
    phone: "(555) 123-4567",
    orders: 4,
    totalSpent: "$9,900",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1007",
    company: "Bay Area Tech Summit",
    contact: "Chris Nakamura",
    email: "chris@techsummit.io",
    phone: "(555) 123-4567",
    orders: 10,
    totalSpent: "$4,800",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1008",
    company: "Golden State Realty",
    contact: "Natalie Reeves",
    email: "natalie@gsrealty.com",
    phone: "(555) 123-4567",
    orders: 2,
    totalSpent: "$14,500",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
  },
];

const Customers = () => {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/admin/dashboard" className="mt-1">
            <ArrowLeft className="w-5 h-5 text-[#5C7899] hover:text-[#111827]" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-[#111827] mb-1">
              Customers
            </h1>
            <p className="text-sm text-[#5C7899]">
              Manage your clients and their details.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/customers/new">
            <Button className="h-10 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white rounded-lg gap-2 font-medium">
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Row */}
      <div className="bg-white p-2 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <InputGroup className="h-10 border-none bg-white focus-within:ring-0">
          <InputGroupAddon>
            <Search className="w-4 h-4 text-[#A0B0C0]" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search customers..."
            className="text-sm placeholder:text-[#A0B0C0] bg-white"
          />
        </InputGroup>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#5C7899] bg-white border-b border-[#F1F5F9]">
              <tr>
                <th className="px-6 py-4 font-semibold">Company / Contact</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold text-center">Orders</th>
                <th className="px-6 py-4 font-semibold text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {customersData.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={customer.avatar} 
                        alt={customer.contact} 
                        className="w-10 h-10 rounded-full object-cover border border-[#F1F5F9]"
                      />
                      <div>
                        <div className="font-semibold text-[#0077FF] hover:underline cursor-pointer">
                          {customer.company}
                        </div>
                        <div className="text-[#5C7899] text-xs mt-0.5">
                          {customer.contact}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[#5C7899] hover:text-[#111827] cursor-pointer">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5C7899]">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[#111827] font-medium">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 text-right text-[#111827] font-medium">
                    {customer.totalSpent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center p-4 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0077FF] text-white text-sm font-semibold">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-[#5C7899] hover:bg-slate-100 text-sm font-medium">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-[#5C7899] hover:bg-slate-100 text-sm font-medium">
              3
            </button>
            <span className="px-2 text-[#A0B0C0]">...</span>
            <button className="px-3 h-8 flex items-center justify-center rounded text-[#5C7899] hover:bg-slate-100 text-sm font-medium">
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
