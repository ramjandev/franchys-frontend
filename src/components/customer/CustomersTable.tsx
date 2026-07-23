import Pagination from "@/components/shared/Pagination";
import { useGetAllCustomersQuery } from "@/store/Customer/customerAPI";
import { Mail, Phone } from "lucide-react";
import DashboardSearch from "../shared/DashboardSearch";
import LoadingStatus from "../shared/loading/LoadingStatus";

export const tableDesign = {
  table:
    "w-full border-collapse border border-border rounded-lg overflow-hidden",
  thead: "text-xs text-[#45556C]! bg-[#F8FAFC]",
  tbody: "text-[#0F172B] bg-white",
  tr: "text-[#101828] text-sm hover:bg-slate-50 transition-colors",
  th: "py-4 px-6 text-xs font-semibold text-[#4A5565] border-b border-border",
  td: "py-4 px-6 text-sm text-[#101828] border-b border-border",
};

const tableHeaders = [
  { label: "Company / Contact", align: "text-left" },
  { label: "Contact Info", align: "text-left" },
  { label: "Orders", align: "text-center" },
  { label: "Total Spent", align: "text-right" },
];
const avatar =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80";

const CustomersTable = () => {
  const { data, isLoading } = useGetAllCustomersQuery();
  const customersData = data?.data ?? [];
  return (
    <>
      <DashboardSearch placeholder="Search customers..." />

      <LoadingStatus
        isLoading={isLoading}
        items={customersData}
        itemName="customers"
      />

      {!isLoading && customersData.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className={tableDesign.thead}>
                <tr>
                  {tableHeaders.map((item, index) => (
                    <th
                      key={index}
                      className={`${item.align} ${tableDesign.th}`}
                    >
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
                          src={avatar}
                          alt="sdfasd"
                          className="w-10 h-10 rounded-full object-cover border border-[#F1F5F9]"
                        />
                        <div>
                          <div className="font-semibold text-[#0077FF] hover:underline cursor-pointer">
                            {customer.companyName}
                          </div>
                          <div className="text-[#5C7899] text-xs mt-0.5">
                            {customer.companyName}
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
                      {customer.secondaryEmail}
                    </td>

                    <td
                      className={`${tableDesign.td} text-right font-semibold`}
                    >
                      {customer.postalCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="py-5">
            <Pagination
              currentPage={1}
              totalPages={5}
              onPageChange={() => {}}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomersTable;
