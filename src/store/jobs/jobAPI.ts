import { baseAPI } from "../BaseApi/baseAPI";
import {
  CreateJobPayload,
  CreateJobResponse,
  GetJobByIdResponse,
  GetJobsParams,
  GetJobsResponse,
  UpdateJobChecklistPayload,
  UpdateJobChecklistResponse,
  UpdateJobPayload,
  UpdateJobResponse,
  UpdateJobStatusPayload,
  UpdateJobStatusResponse,
} from "./types/jobTypes";

export const jobAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createJob: build.mutation<CreateJobResponse, CreateJobPayload>({
      query: (data) => ({
        url: `/job`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),

    getJobs: build.query<GetJobsResponse, GetJobsParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        if (params?.search) queryParams.search = params.search;
        if (params?.status) queryParams.status = params.status;
        if (params?.date) queryParams.date = params.date;
        if (params?.amount !== undefined && params?.amount !== "")
          queryParams.amount = params.amount;
        if (params?.sortBy) queryParams.sortBy = params.sortBy;
        if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

        return {
          url: `/job`,
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Job"],
    }),

    getJobById: build.query<GetJobByIdResponse, string>({
      query: (id) => ({
        url: `/job/${id}`,
        method: "GET",
      }),
      providesTags: ["Job"],
    }),

    updateJob: build.mutation<
      UpdateJobResponse,
      { id: string; data: UpdateJobPayload }
    >({
      query: ({ id, data }) => ({
        url: `/job/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),

    deleteJob: build.mutation<void, string>({
      query: (id) => ({
        url: `/job/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),

    updateJobStatus: build.mutation<
      UpdateJobStatusResponse,
      { id: string; data: UpdateJobStatusPayload }
    >({
      query: ({ id, data }) => ({
        url: `/job/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),

    updateJobChecklist: build.mutation<
      UpdateJobChecklistResponse,
      { id: string; data: UpdateJobChecklistPayload }
    >({
      query: ({ id, data }) => ({
        url: `/job/${id}/checklist`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Job", id },
        { type: "Job", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useGetJobsQuery,
  useGetJobByIdQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useUpdateJobStatusMutation,
  useUpdateJobChecklistMutation,
} = jobAPI;
