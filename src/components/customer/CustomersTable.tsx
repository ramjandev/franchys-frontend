import CommonSelect from "@/components/shared/CommonSelect";
import DeleteAlert from "@/components/shared/DeleteButton";
import IconActionButton from "@/components/shared/IconActionButton";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import SearchSpinner from "@/components/shared/loading/SearchSpinner";
import Pagination from "@/components/shared/Pagination";
import { useDebounce } from "@/components/shared/useDebounce";
import {
  useDeleteCustomerMutation,
  useGetAllCustomersQuery,
} from "@/store/Customer/customerAPI";
import {
  CustomerSortBy,
  CustomerSortOrder,
  CustomerType,
} from "@/store/Customer/types/customerTypes";
import { ArrowDown, ArrowUp, ArrowUpDown, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

export const tableDesign = {
  table:
    "w-full border-collapse border border-border rounded-lg overflow-hidden",
  thead: "text-xs text-[#45556C]! bg-[#F8FAFC]",
  tbody: "text-[#0F172B] bg-white",
  tr: "text-[#101828] text-sm hover:bg-slate-50 transition-colors",
  th: "py-4 px-6 text-xs font-semibold text-[#4A5565] border-b border-border",
  td: "py-4 px-6 text-sm text-[#101828] border-b border-border",
};

interface TableHeaderItem {
  label: string;
  align: string;
  key: string;
  sortable?: boolean;
}

const tableHeaders: TableHeaderItem[] = [
  { label: "Customer", align: "text-left", key: "customer" },
  { label: "Contact Info", align: "text-left", key: "contact" },
  { label: "Orders", align: "text-center", key: "orders", sortable: true },
  {
    label: "Total Spent",
    align: "text-center",
    key: "totalSpent",
    sortable: true,
  },
  { label: "Action", align: "text-center", key: "action" },
];

const customerTypeOptions = [
  { label: "All", value: "all" },
  { label: "BUSINESS", value: "BUSINESS" },
  { label: "PERSONAL", value: "PERSONAL" },
];

const avatar =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80";

const CustomersTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [customerType, setCustomerType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("none");
  const [sortOrder, setSortOrder] = useState<string>("none");

  const searchDebounced = useDebounce(search, 500);

  const { data, isLoading, isFetching } = useGetAllCustomersQuery({
    page,
    limit: 10,
    search: searchDebounced ? searchDebounced : undefined,
    customerType:
      customerType !== "all" ? (customerType as CustomerType) : undefined,
    sortBy: sortBy !== "none" ? (sortBy as CustomerSortBy) : undefined,
    sortOrder:
      sortOrder !== "none" ? (sortOrder as CustomerSortOrder) : undefined,
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

  const handleSort = (field: "orders" | "totalSpent") => {
    setPage(1);
    if (sortBy === field) {
      if (sortOrder === "desc") {
        setSortOrder("asc");
      } else if (sortOrder === "asc") {
        setSortBy("none");
        setSortOrder("none");
      } else {
        setSortOrder("desc");
      }
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex-1 relative w-full border border-border bg-white rounded-md outline-none text-text text-base placeholder:text-[#90A1B9] flex items-center gap-2 pl-3">
          <IoSearchSharp className="text-xl text-[#90A1B9]" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="py-3 w-full outline-none text-text text-base placeholder:text-[#90A1B9]"
          />
          {isSearchFetching && (
            <SearchSpinner className="absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <CommonSelect
            item={customerTypeOptions}
            value={customerType}
            onValueChange={(val) => {
              setCustomerType(val);
              setPage(1);
            }}
            placeholder="Customer Type"
            className="w-full! sm:w-auto!"
            w={160}
          />
        </div>
      </div>

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
                      className={`${item.align} ${tableDesign.th} ${
                        item.sortable
                          ? "cursor-pointer select-none hover:bg-slate-100 transition-colors"
                          : ""
                      }`}
                      onClick={() => {
                        if (
                          item.key === "orders" ||
                          item.key === "totalSpent"
                        ) {
                          handleSort(item.key);
                        }
                      }}
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 ${
                          item.align === "text-center" ? "justify-center" : ""
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.sortable && (
                          <span className="text-[#90A1B9]">
                            {sortBy === item.key ? (
                              sortOrder === "asc" ? (
                                <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                            )}
                          </span>
                        )}
                      </div>
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
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border border-[#F1F5F9]"
                        />
                        <div>
                          <Link to={`../customers/edit/${customer.id}`}>
                            <div className="font-semibold text-[#0077FF] hover:underline cursor-pointer">
                              {customer.firstName} {customer.lastName || ""}
                            </div>
                          </Link>
                          <div className="text-[#5C7899] text-xs mt-0.5">
                            {customer.companyName || customer.customerType}
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
                      $
                      {Number(customer.totalSpent ?? 0).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
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
