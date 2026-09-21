import {
  ApiResponse,
  PaginatedApiResponse,
} from "@/store/Auth/types/authTypes";
import { Quote } from "@/store/quote/types/quoteTypes";

// ---- Job ----

export type JobStatus =
  | "QUOTE"
  | "APPROVED"
  | "ART"
  | "NEED_TO_ORDER"
  | "ORDER_ARRIVED"
  | "PRODUCTION"
  | "PAYMENT"
  | "SHIP"
  | "COMPLETED";

export interface JobHistoryEntry {
  id?: string;
  jobId?: string;
  status: JobStatus;
  note?: string;
  createdAt?: string;
}

export interface Job {
  id: string;
  jobId: string;
  clientName: string;
  description: string;
  status: JobStatus;
  dueDate: string | null;

  amount: string;
  quoteId: string | null;
  createdAt: string;
  updatedAt: string;
  quote: Quote | null;
}

export interface JobWithHistory extends Job {
  history: JobHistoryEntry[];
}

// ---- Request payloads ----

export interface CreateJobPayload {
  jobId: string;
  clientName: string;
  description: string;
  status: JobStatus;
  dueDate: string;
  amount: number;
  quoteId?: string;
}

export type UpdateJobPayload = Partial<CreateJobPayload>;

export interface UpdateJobStatusPayload {
  status: JobStatus;
  note: string;
}

export interface GetJobsParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: JobStatus;
}

export type GetJobsResponse = PaginatedApiResponse<Job[]>;
export type GetJobByIdResponse = ApiResponse<JobWithHistory>;
export type CreateJobResponse = ApiResponse<Job>;
export type UpdateJobResponse = ApiResponse<Job>;
export type UpdateJobStatusResponse = ApiResponse<JobWithHistory>;
