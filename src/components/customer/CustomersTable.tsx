import Pagination from "@/components/shared/Pagination";
import { Mail, Phone } from "lucide-react";
import DashboardSearch from "../shared/DashboardSearch";

export const tableDesign = {
  table:
    "w-full border-collapse border border-border rounded-lg overflow-hidden",
  thead: "text-xs text-[#45556C]! bg-[#F8FAFC]",
  tbody: "text-[#0F172B] bg-white",
  tr: "text-[#101828] text-sm hover:bg-slate-50 transition-colors",
  th: "py-4 px-6 text-xs font-semibold text-[#4A5565] border-b border-border",
  td: "py-4 px-6 text-sm text-[#101828] border-b border-border",
};

const customersData = [
  {
    id: "C-1001",
    company: "Riverside Church",
    contact: "David Miller",
    email: "david@riverside.org",
    phone: "(555) 123-4567",
    orders: 12,
    totalSpent: "$14,500",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1002",
    company: "Metro Fire Department",
    contact: "Sarah Jenkins",
    email: "sjenkins@metrofire.gov",
    phone: "(555) 123-4567",
    orders: 5,
    totalSpent: "$6,100",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1003",
    company: "Lincoln High School",
    contact: "Michael Chang",
    email: "mchang@lincolnhs.edu",
    phone: "(555) 123-4567",
    orders: 8,
    totalSpent: "$2,400",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1004",
    company: "Craft Brewery Co",
    contact: "Jessica Torres",
    email: "jessica@craftbrewery.com",
    phone: "(555) 123-4567",
    orders: 3,
    totalSpent: "$540",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1005",
    company: "Summit CrossFit",
    contact: "Tom Bradley",
    email: "tom@summitcrossfit.com",
    phone: "(555) 123-4567",
    orders: 1,
    totalSpent: "$1,200",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1006",
    company: "Downtown Dental",
    contact: "David Miller",
    email: "echen@downtowndental.com",
    phone: "(555) 123-4567",
    orders: 4,
    totalSpent: "$9,900",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1007",
    company: "Bay Area Tech Summit",
    contact: "Chris Nakamura",
    email: "chris@techsummit.io",
    phone: "(555) 123-4567",
    orders: 10,
    totalSpent: "$4,800",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
  },
  {
    id: "C-1008",
    company: "Golden State Realty",
    contact: "Natalie Reeves",
    email: "natalie@gsrealty.com",
    phone: "(555) 123-4567",
    orders: 2,
    totalSpent: "$14,500",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
  },
];

const tableHeaders = [
  { label: "Company / Contact", align: "text-left" },
  { label: "Contact Info", align: "text-left" },
  { label: "Orders", align: "text-center" },
  { label: "Total Spent", align: "text-right" },
];

const CustomersTable = () => {
  return (
    <>
      <DashboardSearch placeholder="Search customers..." />
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className={tableDesign.thead}>
              <tr>
                {tableHeaders.map((item, index) => (
                  <th key={index} className={`${item.align} ${tableDesign.th}`}>
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className={tableDesign.tbody}>
              {customersData.map((customer) => (
                <tr key={customer.id} className={tableDesign.tr}>
                  <td className={tableDesign.td}>
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

                  <td className={tableDesign.td}>
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

                  <td className={`${tableDesign.td} text-center font-medium`}>
                    {customer.orders}
                  </td>

                  <td className={`${tableDesign.td} text-right font-semibold`}>
                    {customer.totalSpent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-5">
          <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
        </div>
      </div>
    </>
  );
};

export default CustomersTable;
