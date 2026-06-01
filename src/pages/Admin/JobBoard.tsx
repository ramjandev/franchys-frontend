import {
  INITIAL_COLUMNS,
  type Column,
  type ListRow,
} from "@/components/admin/jobBoard/Data";
import ListView from "@/components/admin/jobBoard/ListView";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { useState } from "react";

const flattenCards = (cols: Column[]): ListRow[] =>
  cols.flatMap((col) => col.cards.map((c) => ({ ...c, colId: col.id })));

export default function JobBoard() {
  const [listRows, setListRows] = useState<ListRow[]>(() =>
    flattenCards(INITIAL_COLUMNS),
  );

  const handleListStatus = (rowIdx: number, newStatus: string): void => {
    setListRows((prev) =>
      prev.map((r, i) => (i === rowIdx ? { ...r, status: newStatus } : r)),
    );
  };

  const handleListDelete = (rowIdx: number): void => {
    setListRows((prev) => prev.filter((_, i) => i !== rowIdx));
  };

  const handleListDuplicate = (rowIdx: number): void => {
    setListRows((prev) => {
      const copy: ListRow = {
        ...prev[rowIdx],
        jobId: `${prev[rowIdx].jobId}-copy`,
      };
      const next = [...prev];
      next.splice(rowIdx + 1, 0, copy);
      return next;
    });
  };

  return (
    <div className="">
      <DashboardTopSection
        title="Job Board"
        description="Manage all jobs in list view."
        backButton
      />

      <ListView
        rows={listRows}
        onStatusChange={handleListStatus}
        onDelete={handleListDelete}
        onDuplicate={handleListDuplicate}
      />
    </div>
  );
}
