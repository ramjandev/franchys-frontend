import Pagination from "@/components/shared/Pagination";
import { tableDesign } from "../quotes/QuoteLists";

const customerData = [
  {
    id: 1,
    customer: "Acme Corp",
    product: "Business Cards",
    dueDate: "Apr 28, 2026",
    total: "$1250.00",
    user: "Mike's Cool Shirts",
    status: "In Progress",
    statusColor: "bg-[#5BC0DE]",
  },
  {
    id: 2,
    customer: "TechStart Inc",
    product: "T-Shirts",
    dueDate: "Apr 26, 2026",
    total: "$50.00",
    user: "Mike's Cool Shirts",
    status: "Completed",
    statusColor: "bg-[#5CB85C]",
  },
  {
    id: 3,
    customer: "Creative Agency",
    product: "Posters",
    dueDate: "Apr 30, 2026",
    total: "$25.00",
    user: "Mike's Cool Shirts",
    status: "Pending",
    statusColor: "bg-[#428BCA]",
  },
  {
    id: 4,
    customer: "Local Bakery",
    product: "Packaging",
    dueDate: "May 2, 2026",
    total: "$250.00",
    user: "Mike's Cool Shirts",
    status: "In Progress",
    statusColor: "bg-[#5BC0DE]",
  },
  {
    id: 5,
    customer: "Fashion Brand",
    product: "Labels",
    dueDate: "Apr 25, 2026",
    total: "$750.00",
    user: "Mike's Cool Shirts",
    status: "Completed",
    statusColor: "bg-[#5CB85C]",
  },
];
const tableHeaders = [
  { label: "#", align: "text-center " },
  { label: "Customer/Contact", align: "text-left " },
  { label: "Estimated Due Date", align: "text-left " },
  { label: "Total", align: "text-left" },
  { label: "User", align: "text-left " },
  { label: "Status", align: "text-left " },
];
const CustomerList = () => {
  return (
    <div className="bg-white rounded-xl  overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#5C7899] bg-[#F9FAFB] border-b border-border">
            <tr>
              {tableHeaders.map((item, index) => (
                <th key={index} className={` ${item.align} ${tableDesign.th}`}>
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="">
            {customerData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className={tableDesign.td}>{item.id}</td>

                <td className={tableDesign.td}>
                  <div className="font-semibold text-[#0077FF]">
                    {item.customer}
                  </div>

                  <div className="text-[#6A7282] text-xs mt-0.5">
                    {item.product}
                  </div>
                </td>

                <td className={tableDesign.td}>{item.dueDate}</td>

                <td className={` font-semibold ${tableDesign.td}`}>
                  {item.total}
                </td>

                <td className={tableDesign.td}>{item.user}</td>

                <td className={tableDesign.td}>
                  <span
                    className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded text-white text-xs font-semibold ${item.statusColor}`}
                  >
                    {item.status}
                  </span>
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
  );
};

export default CustomerList;
