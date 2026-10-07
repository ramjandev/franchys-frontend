import SearchSpinner from "@/components/shared/loading/SearchSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobSortBy, JobSortOrder, JobStatus } from "@/store/jobs/types/jobTypes";
import {
  ArrowUpDown,
  Calendar,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import React from "react";
import { IoSearchSharp } from "react-icons/io5";
import { STATUS_OPTIONS } from "./Data";

export type StatusFilterValue = JobStatus | "all";

export interface JobFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusChange: (status: StatusFilterValue) => void;
  dateFilter: string;
  onDateChange: (date: string) => void;
  amountFilter: string;
  onAmountChange: (amount: string) => void;
  sortBy: string;
  sortOrder: string;
  onSortChange: (field: JobSortBy | "none", order: JobSortOrder | "none") => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  isFetching?: boolean;
  totalResults?: number;
}

const sortOptions = [
  { label: "Default sorting", value: "none" },
  { label: "Due Date (Earliest first)", value: "dueDate_asc" },
  { label: "Due Date (Latest first)", value: "dueDate_desc" },
  { label: "Amount (High to Low)", value: "amount_desc" },
  { label: "Amount (Low to High)", value: "amount_asc" },
  { label: "Date Created (Newest)", value: "createdAt_desc" },
  { label: "Date Created (Oldest)", value: "createdAt_asc" },
];

const JobFilters: React.FC<JobFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  amountFilter,
  onAmountChange,
  sortBy,
  sortOrder,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
  isFetching = false,
  totalResults,
}) => {
  const currentSortKey =
    sortBy !== "none" && sortOrder !== "none"
      ? `${sortBy === "date" ? "dueDate" : sortBy}_${sortOrder}`
      : "none";

  const handleSortSelect = (value: string) => {
    if (value === "none") {
      onSortChange("none", "none");
    } else {
      const [field, order] = value.split("_") as [JobSortBy, JobSortOrder];
      onSortChange(field, order);
    }
  };

  const activeStatusOption = STATUS_OPTIONS.find((s) => s.key === statusFilter);
  const activeSortOption = sortOptions.find((s) => s.value === currentSortKey);

  return (
    <div className="space-y-3">
      {/* Primary Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 relative w-full h-11 border border-border bg-white rounded-lg flex items-center px-3 gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <IoSearchSharp className="text-xl text-[#90A1B9] shrink-0" />
          <input
            type="text"
            placeholder="Search by job ID, client, or description..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-full bg-transparent outline-none text-sm text-[#0F172B] placeholder:text-[#90A1B9]"
          />
          {isFetching && (
            <SearchSpinner className="shrink-0" />
          )}
          {search && !isFetching && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Dropdown */}
          <div className="w-full sm:w-auto">
            <Select
              value={statusFilter}
              onValueChange={(val) => onStatusChange(val as StatusFilterValue)}
            >
              <SelectTrigger className="w-full! sm:w-[170px]! h-11! bg-white border-border rounded-lg text-sm px-3 cursor-pointer">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border rounded-lg shadow-md z-50">
                <SelectItem value="all" className="cursor-pointer py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                    <span>All Status</span>
                  </div>
                </SelectItem>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.key}
                    value={opt.key}
                    className="cursor-pointer py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: opt.color }}
                      />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="relative flex items-center h-11 border border-border bg-white rounded-lg px-3 w-full sm:w-auto focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <Calendar className="w-4 h-4 text-[#90A1B9] mr-2 shrink-0 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              className="outline-none text-sm text-[#0F172B] bg-transparent cursor-pointer"
              title="Filter by due date"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => onDateChange("")}
                className="ml-2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer rounded-full hover:bg-slate-100 transition-colors"
                title="Clear date filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Amount Filter */}
          <div className="relative flex items-center h-11 border border-border bg-white rounded-lg px-3 w-full sm:w-auto focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <span className="text-[#90A1B9] text-sm font-medium mr-1.5 select-none">$</span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Amount"
              value={amountFilter}
              onChange={(e) => onAmountChange(e.target.value)}
              className="outline-none text-sm text-[#0F172B] w-24 bg-transparent placeholder:text-[#90A1B9]"
              title="Filter by amount"
            />
            {amountFilter && (
              <button
                type="button"
                onClick={() => onAmountChange("")}
                className="ml-1 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer rounded-full hover:bg-slate-100 transition-colors"
                title="Clear amount filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto">
            <Select
              value={currentSortKey}
              onValueChange={handleSortSelect}
            >
              <SelectTrigger className="w-full! sm:w-[190px]! h-11! bg-white border-border rounded-lg text-sm px-3 cursor-pointer">
                <div className="flex items-center gap-2 truncate">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#90A1B9] shrink-0" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border rounded-lg shadow-md z-50">
                {sortOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="cursor-pointer py-2 text-xs sm:text-sm"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center justify-center gap-1.5 h-11 px-3.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-lg border border-rose-200 transition-colors cursor-pointer whitespace-nowrap shadow-xs w-full sm:w-auto"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Badges & Summary */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 pb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-medium text-[#5C7899]">
              <SlidersHorizontal className="w-3 h-3 text-[#90A1B9]" />
              Active filters:
            </span>

            {search && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-blue-50 border border-blue-200 text-blue-700 font-medium">
                Search: &quot;{search}&quot;
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="hover:text-blue-900 cursor-pointer p-0.5 rounded-full hover:bg-blue-100"
                  title="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {statusFilter !== "all" && activeStatusOption && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border font-medium ${activeStatusOption.bg} ${activeStatusOption.border} ${activeStatusOption.text}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: activeStatusOption.color }}
                />
                Status: {activeStatusOption.label}
                <button
                  type="button"
                  onClick={() => onStatusChange("all")}
                  className="hover:opacity-75 cursor-pointer p-0.5 rounded-full"
                  title="Remove status filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {dateFilter && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-amber-50 border border-amber-200 text-amber-700 font-medium">
                Date: {dateFilter}
                <button
                  type="button"
                  onClick={() => onDateChange("")}
                  className="hover:text-amber-900 cursor-pointer p-0.5 rounded-full hover:bg-amber-100"
                  title="Remove date filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {amountFilter && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
                Amount: ${amountFilter}
                <button
                  type="button"
                  onClick={() => onAmountChange("")}
                  className="hover:text-emerald-900 cursor-pointer p-0.5 rounded-full hover:bg-emerald-100"
                  title="Remove amount filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {currentSortKey !== "none" && activeSortOption && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-purple-50 border border-purple-200 text-purple-700 font-medium">
                Sort: {activeSortOption.label}
                <button
                  type="button"
                  onClick={() => onSortChange("none", "none")}
                  className="hover:text-purple-900 cursor-pointer p-0.5 rounded-full hover:bg-purple-100"
                  title="Remove custom sorting"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 underline font-medium cursor-pointer ml-1"
            >
              Clear all
            </button>
          </div>

          {totalResults !== undefined && (
            <span className="text-xs text-[#5C7899] font-medium">
              Found {totalResults} {totalResults === 1 ? "job" : "jobs"}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilters;
