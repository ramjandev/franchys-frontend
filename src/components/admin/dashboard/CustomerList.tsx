import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import Pagination from "@/components/shared/Pagination";
import StatusBadge from "@/components/shared/StatusBadge";
import { useGetAllCustomersQuery } from "@/store/Customer/customerAPI";
import { useState } from "react";
import { tableDesign } from "../quotes/QuoteLists";

const tableHeaders = [
  { label: "#", align: "text-center " },
  { label: "Customer", align: "text-left " },
  { label: "Company", align: "text-left " },
  { label: "Orders", align: "text-left" },
  { label: "Type", align: "text-left " },
  { label: "Status", align: "text-left " },
];

const CustomerList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllCustomersQuery({ page, limit: 10 });
  const customersData = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div>
      <LoadingStatus
        isLoading={isLoading}
        items={customersData}
        itemName="customers"
      />

      {!isLoading && customersData.length > 0 && (
        <div className="bg-white rounded-xl  overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#5C7899] bg-[#F9FAFB] border-b border-border">
                <tr>
                  {tableHeaders.map((item, index) => (
                    <th
                      key={index}
                      className={` ${item.align} ${tableDesign.th}`}
                    >
                      {item.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="">
                {customersData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className={`${tableDesign.td} text-center`}>
                      {(page - 1) * 10 + index + 1}
                    </td>

                    <td className={tableDesign.td}>
                      <div className="font-semibold text-[#0077FF]">
                        {item.firstName} {item.lastName || ""}
                      </div>

                      <div className="text-[#6A7282] text-xs mt-0.5">
                        {item.email}
                      </div>
                    </td>

                    <td className={tableDesign.td}>
                      {item.companyName || "—"}
                    </td>

                    <td className={` font-semibold ${tableDesign.td}`}>
                      {item.orders}
                    </td>

                    <td className={tableDesign.td}>{item.customerType}</td>

                    <td className={tableDesign.td}>
                      <StatusBadge
                        status={item.isDeleted ? "deleted" : "active"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="py-5">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
