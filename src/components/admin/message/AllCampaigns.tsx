import CommonButton from "@/components/shared/CommonButton";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import DashboardCardSkeleton from "@/components/shared/loading/DashboardCardSkeleton";
import { useDebounce } from "@/components/shared/useDebounce";
import { loadingArray } from "@/lib/utils";
import { useGetAllCustomersQuery } from "@/store/Customer/customerAPI"; // adjust to your actual api slice path
import { Customer, CustomerType } from "@/store/Customer/types/customerTypes"; // adjust to your actual types path
import { useState } from "react";
import PromotionalModal from "./PromotionalModal";

const typeBadgeStyles: Record<CustomerType, string> = {
  PERSONAL: "bg-purple-100 text-purple-600",
  BUSINESS: "bg-amber-100 text-amber-600",
};

function getInitials(
  firstName?: string | null,
  lastName?: string | null,
) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

const AllCampaigns = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);

  const { data, isLoading, isFetching, isError } = useGetAllCustomersQuery({
    search: searchDebounced,
    page: 1,
    limit: 100,
  });

  const customers: Customer[] = data?.data ?? [];

  const onToggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div>
      <DashboardTopSection
        title="Promotions"
        description="Create and manage promotional campaigns, discounts, and special offers."
        backButton
      />
      <div className="shrink-0 bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[15px] text-slate-800">
            Customers
          </span>
          <span className="bg-slate-100 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
            {selected.length} selected
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0">
          Select customers to include in your campaign
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
        />
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {loadingArray(12).map((_, index) => (
              <DashboardCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!isLoading && !isError && customers.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-400">
            No customers found.
          </div>
        )}
        <div
          className={` grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 ${isFetching ? "opacity-60" : ""}`}
        >
          {customers.map((c) => {
            const sel = selected.includes(c.id);
            const fullName = `${c.firstName} ${c.lastName || ""}`.trim();

            return (
              <button
                key={c.id}
                onClick={() => onToggle(c.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                  sel
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                {c.profileImage ? (
                  <img
                    src={c.profileImage}
                    alt={fullName}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <span className="w-9 h-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {getInitials(c.firstName, c.lastName)}
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {fullName}
                    </p>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                        typeBadgeStyles[c.customerType]
                      }`}
                    >
                      {c.customerType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{c.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm font-bold text-blue-500">
                      {formatCurrency(c.totalSpent)}
                    </p>
                    <span className="text-xs text-slate-400">
                      · {c.orders} order{c.orders === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                {sel && (
                  <span className="text-blue-500 text-base shrink-0">✓</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3">
          {selected.length > 0 && (
            <div className="rounded-lg bg-green-50 px-5 py-2.5 text-center text-sm font-semibold text-green-600 w-fit">
              {selected.length} customer{selected.length > 1 ? "s" : ""} linked
            </div>
          )}

          <CommonButton
            onClick={() => setIsOpen(true)}
            isLoading={isLoading}
            loadingText="Sending..."
          >
            Send Promotions
          </CommonButton>
        </div>
        {isOpen && (
          <PromotionalModal
            close={() => setIsOpen(false)}
            selectedCustomerIds={selected}
          />
        )}
      </div>
    </div>
  );
};

export default AllCampaigns;
