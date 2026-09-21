import CommonHeader from "@/components/shared/CommonHeader";
import DeleteAlert from "@/components/shared/DeleteButton";
import {
  useDeleteJobMutation,
  useUpdateJobStatusMutation,
} from "@/store/jobs/jobAPI";

import IconActionButton from "@/components/shared/IconActionButton";
import Pagination from "@/components/shared/Pagination";
import { formatDate } from "@/lib/utils";
import { Job, JobStatus } from "@/store/jobs/types/jobTypes";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { tableDesign } from "../quotes/QuoteLists";
import StatusPill from "./StatusPill";
import WorkflowStages from "./WorkflowStages";

export const statusChangeSchema = z.object({
  status: z.enum([
    "QUOTE",
    "APPROVED",
    "ART",
    "NEED_TO_ORDER",
    "ORDER_ARRIVED",
    "PRODUCTION",
    "PAYMENT",
    "SHIP",
    "COMPLETED",
  ]),
  note: z.string().trim(),
});

export type StatusChangeValues = z.infer<typeof statusChangeSchema>;
interface ListViewProps {
  jobs: Job[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  isLoading: boolean;
}

const ListView: React.FC<ListViewProps> = ({
  jobs,
  page,
  setPage,
  totalPages,
}) => {
  const [updateJobStatus] = useUpdateJobStatusMutation();
  const [deleteJob] = useDeleteJobMutation();

  const total = jobs.reduce((sum, j) => sum + (parseFloat(j.amount) || 0), 0);

  const tableHeaders = [
    { label: "Job Number", align: "text-left" },
    { label: "Client", align: "text-left" },
    { label: "Description", align: "text-left" },
    { label: "Status", align: "text-left" },
    { label: "Date", align: "text-left" },
    { label: "Amount", align: "text-left" },
    { label: "Action", align: "text-center" },
  ];

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    const result = statusChangeSchema.safeParse({
      status: newStatus, // already uppercase from the caller
      note: "changed status",
    });

    if (!result.success) {
      console.error("Invalid status", result.error);
      return;
    }

    try {
      await updateJobStatus({
        id: jobId,
        data: {
          status: result.data.status as JobStatus,
          note: result.data.note,
        },
      }).unwrap();
    } catch (err) {
      console.error("Failed to update job status", err);
    }
  };
  const handleDelete = async (jobId: string) => {
    try {
      await deleteJob(jobId).unwrap();
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  const navigate = useNavigate();

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
              {jobs.map((job) => (
                <tr key={job.id} className={tableDesign.tr}>
                  <td className={`${tableDesign.td} font-semibold`}>
                    {job.jobId}
                  </td>
                  <td className={`${tableDesign.td} font-medium`}>
                    {job.clientName}
                  </td>
                  <td className={`${tableDesign.td} text-xs`}>
                    {job.description}
                  </td>
                  <td className={tableDesign.td}>
                    <StatusPill
                      statusKey={job.status.toLowerCase()}
                      onChange={(key) =>
                        handleStatusChange(job.id, key.toUpperCase())
                      }
                    />
                  </td>

                  <td className={tableDesign.td}>{formatDate(job.dueDate)}</td>
                  <td className={`${tableDesign.td} font-semibold`}>
                    ${job.amount}
                  </td>
                  <td className={`${tableDesign.td} text-center`}>
                    <div className="flex justify-center">
                      <DeleteAlert action={() => handleDelete(job.id)} />
                      <IconActionButton
                        variant="view"
                        title="View"
                        onClick={() => navigate(`/admin/job-board/${job.id}`)}
                      />
                    </div>
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
          <span className="font-bold text-[#294566] ml-1">{jobs.length}</span>
        </CommonHeader>
        <div>
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
        <CommonHeader size="xs" className="text-[#5C7899]">
          Total:
          <span className="font-bold text-[#294566]  ml-1">
            ${total.toFixed(2)}
          </span>
        </CommonHeader>
      </div>
    </div>
  );
};

export default ListView;
