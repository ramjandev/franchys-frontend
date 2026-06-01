import CommonHeader from "@/components/shared/CommonHeader";
import { tableDesign } from "../quotes/QuoteLists";
import ActionMenu from "./ActionMenu";
import { type ListRow } from "./Data";
import StatusPill from "./StatusPill";
import WorkflowStages from "./WorkflowStages";

interface ListViewProps {
  rows: ListRow[];
  onStatusChange: (rowIdx: number, key: string) => void;
  onDelete: (rowIdx: number) => void;
  onDuplicate: (rowIdx: number) => void;
}
const ListView: React.FC<ListViewProps> = ({
  rows,
  onStatusChange,
  onDelete,
  onDuplicate,
}) => {
  const total = rows.reduce(
    (sum, r) => sum + parseFloat(r.amount.replace(/[$,]/g, "")),
    0,
  );

  const tableHeaders = [
    { label: "Job Number", align: "text-left" },
    { label: "Client", align: "text-left" },
    { label: "Description", align: "text-left" },
    { label: "Status", align: "text-left" },
    { label: "Production Stage", align: "text-left" },
    { label: "Date", align: "text-left" },
    { label: "Amount", align: "text-left" },
    { label: "Action", align: "text-center" },
  ];

  return (
    <div className="space-y-6">
      <WorkflowStages />

      <div className="bg-white rounded-xl  overflow-hidden">
        <div className="overflow-x-auto">
          <table className={tableDesign.table}>
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
              {rows.map((row, i) => (
                <tr key={`${row.jobId}-${i}`} className={tableDesign.tr}>
                  <td className={`${tableDesign.td} font-semibold`}>
                    {row.jobId}
                  </td>
                  <td className={`${tableDesign.td} font-medium`}>
                    {row.customer}
                  </td>
                  <td className={`${tableDesign.td} text-xs`}>{row.title}</td>
                  <td className={tableDesign.td}>
                    <StatusPill
                      statusKey={row.status}
                      onChange={(key) => onStatusChange(i, key)}
                    />
                  </td>
                  <td className={tableDesign.td}>
                    <div className=" text-[#5C7899] bg-[#F1F5F9] whitespace-nowrap  px-2 py-1.5 rounded-md max-w-[175px]">
                      {row.productionStage}
                    </div>
                  </td>
                  <td className={tableDesign.td}>{row.due ?? "—"}</td>
                  <td className={`${tableDesign.td} font-semibold`}>
                    {row.amount}
                  </td>
                  <td className={`${tableDesign.td} text-center`}>
                    <ActionMenu
                      onDuplicate={() => onDuplicate(i)}
                      onDelete={() => onDelete(i)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex  justify-between items-center gap-4">
        <CommonHeader size="xs" className="text-[#5C7899]">
          Total Jobs:
          <span className="font-bold text-[#294566] ml-1">{rows.length}</span>
        </CommonHeader>
        <CommonHeader size="xs" className="text-[#5C7899]">
          Total:{" "}
          <span className="font-bold text-[#294566]  ml-1">
            ${total.toFixed(2)}
          </span>
        </CommonHeader>
      </div>
    </div>
  );
};

export default ListView;
