import {
  ApiResponse,
  PaginatedApiResponse,
} from "@/store/Auth/types/authTypes";

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

export interface JobSpecification {
  groupName?: string;
  imprintType?: string;
  category?: string;
  description?: string;
  color?: string;
}

export interface ProductionItem {
  id: string;
  lineItemId?: string;
  description: string;
  color?: string;
  size: string;
  quantity: number;
  imprintType?: string | null;
  isDone?: boolean;
}

export interface QcChecklistItem {
  id: string;
  label: string;
  checked?: boolean;
}

export interface JobQuoteCustomer {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string | null;
  email?: string;
  phone?: string;
  companyName?: string | null;
}

export interface JobQuote {
  id: string;
  quoteNumber: string;
  customerId?: string;
  repId?: string;
  poNumber?: string;
  deliveryMethod?: string;
  dueDate?: string | null;
  status?: string;
  subtotal?: string;
  discount?: string;
  taxRate?: string;
  taxAmount?: string;
  total?: string;
  notes?: string | null;
  sentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  customer?: JobQuoteCustomer | null;
  lineItems?: any[];
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
  totalUnits?: number;
  completedItemIds?: string[];
  qcChecklist?: (string | QcChecklistItem)[];
  notes?: string | null;
  mockups?: string[];
  specifications?: JobSpecification[];
  productionItems?: ProductionItem[];
  quote?: JobQuote | null;
  createdAt: string;
  updatedAt: string;
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

export interface UpdateJobChecklistPayload {
  completedItemIds?: string[];
  qcChecklist?: string[];
}

export type JobSortBy = "date" | "dueDate" | "amount" | "createdAt";
export type JobSortOrder = "asc" | "desc";

export interface GetJobsParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: JobStatus;
  date?: string;
  amount?: string | number;
  sortBy?: JobSortBy;
  sortOrder?: JobSortOrder;
}

export type GetJobsResponse = PaginatedApiResponse<Job[]>;
export type GetJobByIdResponse = ApiResponse<JobWithHistory>;
export type CreateJobResponse = ApiResponse<Job>;
export type UpdateJobResponse = ApiResponse<Job>;
export type UpdateJobStatusResponse = ApiResponse<JobWithHistory>;
export type UpdateJobChecklistResponse = ApiResponse<JobWithHistory>;
