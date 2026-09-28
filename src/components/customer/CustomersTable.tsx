import Pagination from "@/components/shared/Pagination";
import {
  useDeleteCustomerMutation,
  useGetAllCustomersQuery,
} from "@/store/Customer/customerAPI";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchWithFilter from "../admin/quotes/SearchWithFilter";
import DeleteAlert from "../shared/DeleteButton";
import IconActionButton from "../shared/IconActionButton";
import LoadingStatus from "../shared/loading/LoadingStatus";
import { useDebounce } from "../shared/useDebounce";

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
  { label: "Customer", align: "text-left" },
  { label: "Contact Info", align: "text-left" },
  { label: "Orders", align: "text-center" },
  { label: "Total Spent", align: "text-center" },
  { label: "Action", align: "text-center" },
];
const avatar =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80";

const CustomersTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);
  const { data, isLoading, isFetching } = useGetAllCustomersQuery({
    page,
    limit: 10,
    search: searchDebounced,
  });
  const customersData = data?.data ?? [];
  const isSearchFetching = isFetching && !!searchDebounced;

  const [deleteCustomer] = useDeleteCustomerMutation();
  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer(id).unwrap();
    } catch (err) {
      console.error("Failed to delete customer", err);
    }
  };
  const [status, setStatus] = useState("all");

  const navigate = useNavigate();
  return (
    <>
      <SearchWithFilter
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        isFetching={isSearchFetching}
        placeholder="Search customers..."
      />
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
                          src={customer.profileImage || avatar}
                          alt="sdfasd"
                          className="w-10 h-10 rounded-full object-cover border border-[#F1F5F9]"
                        />
                        <div>
                          <Link to={`../customers/edit/${customer.id}`}>
                            <div className="font-semibold text-[#0077FF] hover:underline cursor-pointer">
                              {customer.firstName} {customer.lastName}
                            </div>
                          </Link>
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
                      {customer.orders}
                    </td>

                    <td
                      className={`${tableDesign.td} text-center font-semibold`}
                    >
                      ${customer.totalSpent}
                    </td>
                    <td className={tableDesign.td}>
                      <div className="flex items-center gap-2 justify-center">
                        <IconActionButton
                          variant="view"
                          title="View"
                          onClick={() =>
                            navigate(`../customers/edit/${customer.id}`)
                          }
                        />
                        <DeleteAlert action={() => handleDelete(customer.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="py-5">
            <Pagination
              currentPage={page}
              totalPages={data?.meta.totalPages ?? 1}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomersTable;
