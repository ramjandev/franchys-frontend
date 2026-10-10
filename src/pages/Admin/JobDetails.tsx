import shirt from "@/assets/images/shirt.jpg";
import BorderTitle from "@/components/invoice/BorderTitle";
import InfoCheckbox from "@/components/invoice/InfoCheckbox";
import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import InfoCard from "@/components/shared/InfoCard";
import DashboardCardSkeleton from "@/components/shared/loading/DashboardCardSkeleton";
import EmptyState from "@/components/shared/loading/EmptyState";
import { formatDate } from "@/lib/utils";
import {
  useGetJobByIdQuery,
  useUpdateJobChecklistMutation,
} from "@/store/jobs/jobAPI";
import { JobStatus, QcChecklistItem } from "@/store/jobs/types/jobTypes";
import { useEffect, useMemo, useState } from "react";
import { FiPackage } from "react-icons/fi";
import { useParams } from "react-router-dom";

const DEFAULT_QC_DEFINITIONS: { id: string; label: string }[] = [
  {
    id: "specifications",
    label: "All items produced according to specifications",
  },
  {
    id: "artwork_placement",
    label: "Artwork placement and alignment verified",
  },
  {
    id: "color_matching",
    label: "Color matching approved",
  },
  {
    id: "size_breakdown",
    label: "Size breakdown confirmed",
  },
  {
    id: "final_inspection",
    label: "Final inspection completed",
  },
];

const statusStyles: Record<JobStatus, string> = {
  QUOTE: "border-blue-500/30 text-blue-600 bg-blue-50",
  APPROVED: "border-green-500/30 text-green-600 bg-green-50",
  ART: "border-purple-500/30 text-purple-600 bg-purple-50",
  NEED_TO_ORDER: "border-orange-500/30 text-orange-600 bg-orange-50",
  ORDER_ARRIVED: "border-cyan-500/30 text-cyan-600 bg-cyan-50",
  PRODUCTION: "border-amber-400 text-amber-700 bg-amber-100",
  PAYMENT: "border-pink-500/30 text-pink-600 bg-pink-50",
  SHIP: "border-indigo-500/30 text-indigo-600 bg-indigo-50",
  COMPLETED: "border-emerald-500/30 text-emerald-600 bg-emerald-50",
};

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useGetJobByIdQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const [updateJobChecklist, { isLoading: isUpdating }] =
    useUpdateJobChecklistMutation();

  const job = data?.data;

  // Local state for completed item IDs and QC checked IDs for instant optimistic UI
  const [completedItemIds, setCompletedItemIds] = useState<string[]>([]);
  const [qcCheckedIds, setQcCheckedIds] = useState<string[]>([]);
  const [activeMockupIndex, setActiveMockupIndex] = useState<number>(0);

  // Sync state when job data loads or updates
  useEffect(() => {
    if (job) {
      // 1. Completed production items
      const fromField = job.completedItemIds ?? [];
      const fromItems = (job.productionItems || [])
        .filter((item) => item.isDone)
        .map((item) => item.id);
      const combinedCompleted = Array.from(
        new Set([...fromField, ...fromItems]),
      );
      setCompletedItemIds(combinedCompleted);

      // 2. QC checklist items
      if (Array.isArray(job.qcChecklist)) {
        const checked = job.qcChecklist
          .map((item) => {
            if (typeof item === "string") return item;
            if (typeof item === "object" && item !== null) {
              return item.checked ? item.id : null;
            }
            return null;
          })
          .filter(Boolean) as string[];
        setQcCheckedIds(checked);
      }
    }
  }, [job]);

  // Normalized QC items list (custom labels from backend or defaults)
  const qcListItems = useMemo(() => {
    if (!job?.qcChecklist || job.qcChecklist.length === 0) {
      return DEFAULT_QC_DEFINITIONS;
    }

    // Check if qcChecklist contains object items with custom labels
    const hasObjectItems = job.qcChecklist.some(
      (item): item is QcChecklistItem =>
        typeof item === "object" && item !== null && "label" in item,
    );

    if (hasObjectItems) {
      return job.qcChecklist.map((item) => {
        if (typeof item === "object" && item !== null) {
          return { id: item.id, label: item.label };
        }
        const defaultMatch = DEFAULT_QC_DEFINITIONS.find((d) => d.id === item);
        return {
          id: item as string,
          label: defaultMatch ? defaultMatch.label : (item as string),
        };
      });
    }

    return DEFAULT_QC_DEFINITIONS;
  }, [job?.qcChecklist]);

  // Combined mockups from job and quote lineItems
  const allMockups = useMemo(() => {
    const list: string[] = [];
    if (job?.mockups && Array.isArray(job.mockups)) {
      list.push(...job.mockups.filter(Boolean));
    }
    if (job?.quote?.lineItems && Array.isArray(job.quote.lineItems)) {
      job.quote.lineItems.forEach((li) => {
        if (Array.isArray(li.mockups)) {
          li.mockups.forEach((m: string) => {
            if (m && !list.includes(m)) list.push(m);
          });
        }
      });
    }
    return list;
  }, [job?.mockups, job?.quote?.lineItems]);

  // Total units calculated
  const totalUnits = useMemo(() => {
    if (typeof job?.totalUnits === "number") return job.totalUnits;
    if (job?.productionItems && job.productionItems.length > 0) {
      return job.productionItems.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0,
      );
    }
    return 0;
  }, [job?.totalUnits, job?.productionItems]);

  // Customer display name
  const customerName = useMemo(() => {
    if (job?.clientName) return job.clientName;
    const c = job?.quote?.customer;
    if (!c) return "—";
    if (c.companyName) return c.companyName;
    if (c.name) return c.name;
    const fullName = `${c.firstName || ""} ${c.lastName || ""}`.trim();
    return fullName || "—";
  }, [job?.clientName, job?.quote?.customer]);

  // Order date
  const orderDate = useMemo(() => {
    const date = job?.quote?.sentAt || job?.quote?.createdAt || job?.createdAt;
    return date ? formatDate(date) : "—";
  }, [job?.quote?.sentAt, job?.quote?.createdAt, job?.createdAt]);

  // Due date
  const dueDate = useMemo(() => {
    const date = job?.dueDate || job?.quote?.dueDate;
    return date ? formatDate(date) : "—";
  }, [job?.dueDate, job?.quote?.dueDate]);

  // Toggle production item completion (local state only)
  const handleToggleProductionItem = (itemId: string) => {
    setCompletedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  // Toggle QC checklist item (local state only)
  const handleToggleQcItem = (qcId: string) => {
    setQcCheckedIds((prev) =>
      prev.includes(qcId) ? prev.filter((id) => id !== qcId) : [...prev, qcId],
    );
  };

  // Check if any changes have been made compared to server state
  const isDirty = useMemo(() => {
    if (!job) return false;
    const fromField = job.completedItemIds ?? [];
    const fromItems = (job.productionItems || [])
      .filter((item) => item.isDone)
      .map((item) => item.id);
    const initialCompleted = Array.from(new Set([...fromField, ...fromItems]));

    const initialQc = Array.isArray(job.qcChecklist)
      ? (job.qcChecklist
          .map((item) => {
            if (typeof item === "string") return item;
            if (typeof item === "object" && item !== null) {
              return item.checked ? item.id : null;
            }
            return null;
          })
          .filter(Boolean) as string[])
      : [];

    const sortedCurrentCompleted = [...completedItemIds].sort().join(",");
    const sortedInitialCompleted = [...initialCompleted].sort().join(",");

    const sortedCurrentQc = [...qcCheckedIds].sort().join(",");
    const sortedInitialQc = [...initialQc].sort().join(",");

    return (
      sortedCurrentCompleted !== sortedInitialCompleted ||
      sortedCurrentQc !== sortedInitialQc
    );
  }, [job, completedItemIds, qcCheckedIds]);

  // Save changes via PATCH /api/v1/job/:id/checklist
  const handleSaveChanges = async () => {
    if (!job?.id) return;
    try {
      await updateJobChecklist({
        id: job.id,
        data: {
          completedItemIds,
          qcChecklist: qcCheckedIds,
        },
      }).unwrap();
    } catch (err) {
      console.error("Failed to save checklist changes", err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1356px] mx-auto p-6 space-y-6">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-[1356px] mx-auto p-6">
        <EmptyState
          title="Job not found"
          description="The requested job could not be retrieved. Please check the job ID and try again."
        />
      </div>
    );
  }

  const infoData = [
    {
      label: "CUSTOMER",
      value: customerName,
      bg: "bg-[#F8F9FB] border-[#E2E8F0]",
      labelColor: "text-[#64748B]",
      valueColor: "text-[#294566]",
    },
    {
      label: "ORDER DATE",
      value: orderDate,
      bg: "bg-[#F8F9FB] border-[#E2E8F0]",
      labelColor: "text-[#64748B]",
      valueColor: "text-[#294566]",
    },
    {
      label: "DUE DATE",
      value: dueDate,
      bg: "bg-[#FEF2F2] border-[#FECACA]",
      labelColor: "text-[#991B1B]",
      valueColor: "text-[#DC2626]",
    },
    {
      label: "TOTAL UNITS",
      value: String(totalUnits),
      bg: "bg-[#F0FDF4] border-[#BBF7D0]",
      labelColor: "text-[#166534]",
      valueColor: "text-[#16A34A]",
    },
  ];

  const status = job.status as JobStatus;
  const activeMockupUrl =
    allMockups[activeMockupIndex] || allMockups[0] || shirt;

  const notesText = (job.notes || job.quote?.notes || "").trim();

  return (
    <CardContainer
      size="3xl"
      className="shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),_0_4px_6px_-4px_rgba(0,0,0,0.10)] max-w-[1356px] mx-auto print:shadow-none print:border-none print:p-2"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CommonButton className="bg-[#1E3A8A]! text-white! rounded-full! py-1! px-4! text-xs! font-bold! tracking-wide! cursor-auto! pointer-events-none!">
              Production Sheet
            </CommonButton>

            <h1 className="text-2xl sm:text-4xl font-black text-[#294566] tracking-tight leading-none">
              Job # {job.jobId}
            </h1>

            <CommonHeader className="text-[#5C7899]! text-sm font-medium">
              For Production Team Only · No Pricing Info
            </CommonHeader>
          </div>

          <div
            className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border shrink-0 ${
              statusStyles[status] ||
              "border-slate-300 text-slate-700 bg-slate-100"
            }`}
          >
            {status}
          </div>
        </div>

        {/* 4 Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {infoData.map((item) => (
            <InfoCard
              key={item.label}
              label={item.label}
              value={item.value}
              cardClassName={item.bg}
              labelClassName={item.labelColor}
              valueClassName={item.valueColor}
            />
          ))}
        </div>

        {/* Artwork / Mockup */}
        <section className="space-y-4">
          <BorderTitle title="Artwork / Mockup" />

          <div className="rounded-2xl border border-[#CBD5E1] bg-[linear-gradient(135deg,_#F8F9FB_0%,_#F4F6F9_16.67%,_#F1F3F7_33.33%,_#EDF0F6_50%,_#E9EEF4_66.67%,_#E6EBF2_83.33%,_#E2E8F0_100%)] shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] p-6 sm:p-8">
            <div className="rounded-[14px] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),_0_2px_4px_-2px_rgba(0,0,0,0.10)] p-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-[420px] aspect-square rounded-[10px] overflow-hidden flex items-center justify-center bg-[#F8FAFC]">
                <img
                  className="w-full h-full object-contain p-2"
                  src={activeMockupUrl}
                  alt="artwork mockup"
                />
              </div>

              {allMockups.length > 1 && (
                <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full p-1">
                  {allMockups.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMockupIndex(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeMockupIndex === idx
                          ? "border-[#2B4EFF] ring-2 ring-[#2B4EFF]/20 shadow-sm scale-105"
                          : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Decoration Method & Specifications */}
        <section className="space-y-4">
          <BorderTitle title="Decoration Method & Specifications" />

          {job.specifications && job.specifications.length > 0 ? (
            <div className="space-y-3">
              {job.specifications.map((spec, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#FF8B5A] bg-[linear-gradient(90deg,_#FFF7ED_0%,_#FFF6EA_14.29%,_#FFF4E6_28.57%,_#FFF3E3_42.86%,_#FFF1DF_57.14%,_#FFF0DC_71.43%,_#FFEED8_85.71%,_#FFEDD5_100%)] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),_0_1px_2px_-1px_rgba(0,0,0,0.10)] p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B] flex items-center justify-center shrink-0 shadow-sm">
                    <FiPackage className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#294566]">
                      {spec.imprintType?.toUpperCase() || "SPECIFICATION"}
                      {spec.groupName ? ` · ${spec.groupName.toUpperCase()}` : ""}
                    </p>
                    <p className="text-sm text-[#5C7899] mt-0.5">
                      {spec.description}
                      {spec.color && ` · Color: ${spec.color}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-[#64748B]">
              No decoration specifications available for this job.
            </div>
          )}
        </section>

        {/* Items to Produce */}
        <section className="space-y-4 overflow-hidden">
          <BorderTitle title="Items to Produce" />
          <div className="rounded-2xl overflow-hidden border border-border overflow-x-auto shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#294566]">
                  {["Item Description", "Size", "Quantity", "Done"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-center ${
                          i === 0 ? "text-left!" : ""
                        } text-[13px] font-bold tracking-[0.12em] uppercase text-white`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {job.productionItems && job.productionItems.length > 0 ? (
                  job.productionItems.map((item, idx) => {
                    const isDone = completedItemIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`border-t border-border transition-colors ${
                          isDone
                            ? "bg-emerald-50/70"
                            : idx % 2 === 0
                              ? "bg-white"
                              : "bg-[#fafaf8]"
                        }`}
                      >
                        <td className="px-5 py-3.5 text-[#294566] font-medium text-[15px] text-left">
                          {item.description}
                        </td>
                        <td className="px-5 py-3.5 text-[#5C7899] text-[15px] text-center font-medium">
                          {item.size || "—"}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-[#294566] text-[15px] text-center">
                          {item.quantity}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex justify-center">
                            <InfoCheckbox
                              checked={isDone}
                              onChange={() =>
                                handleToggleProductionItem(item.id)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-6 text-center text-sm text-[#64748B] bg-white"
                    >
                      No production items listed for this job.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Additional Production Notes */}
        <section className="space-y-4">
          <BorderTitle title="Additional Production Notes" />
          <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-[#78350F] text-sm font-medium uppercase leading-relaxed tracking-wide shadow-sm">
            {notesText ? notesText : "NO ADDITIONAL PRODUCTION NOTES."}
          </div>
        </section>

        {/* Quality Control Checklist */}
        <section className="space-y-4">
          <BorderTitle title="Quality Control Checklist" />
          <div className="flex flex-col gap-3">
            {qcListItems.map((item) => {
              const isChecked = qcCheckedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleQcItem(item.id)}
                  className={`border rounded-xl px-4 py-3.5 cursor-pointer select-none transition-all ${
                    isChecked
                      ? "bg-emerald-50/50 border-emerald-300 shadow-xs"
                      : "bg-white border-border hover:border-[#CBD5E1]"
                  }`}
                >
                  <InfoCheckbox
                    label={item.label}
                    checked={isChecked}
                    className="pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Right Save Changes Button */}
        <div className="flex justify-end pt-4 border-t border-border/50 print:hidden">
          <CommonButton
            type="button"
            onClick={handleSaveChanges}
            disabled={isUpdating || !isDirty}
            className="bg-[#2B4EFF] hover:bg-[#1E3ECC] text-white px-7 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </CommonButton>
        </div>
      </div>
    </CardContainer>
  );
};

export default JobDetails;
