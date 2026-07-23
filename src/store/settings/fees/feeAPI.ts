import { baseAPI } from "@/store/BaseApi/baseAPI";
import {
  CreateFeeRequest,
  CreateFeeResponse,
  GetAllFeesResponse,
  GetFeeResponse,
  UpdateFeeRequest,
  UpdateFeeResponse,
} from "./types/feeTypes";

export const feeAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createFee: build.mutation<CreateFeeResponse, CreateFeeRequest>({
      query: (data) => ({
        url: "/invoice/fees",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Fee", id: "LIST" }],
    }),

    getAllFees: build.query<GetAllFeesResponse, void>({
      query: () => ({
        url: "/invoice/fees",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ infId }) => ({
                type: "Fee" as const,
                id: infId,
              })),
              { type: "Fee" as const, id: "LIST" },
            ]
          : [{ type: "Fee" as const, id: "LIST" }],
    }),

    getFeeById: build.query<GetFeeResponse, string>({
      query: (infId) => ({
        url: `/invoice/fees/${infId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, infId) => [{ type: "Fee", id: infId }],
    }),

    updateFee: build.mutation<UpdateFeeResponse, UpdateFeeRequest>({
      query: ({ infId, ...data }) => ({
        url: `/invoice/fees/${infId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { infId }) => [
        { type: "Fee", id: infId },
        { type: "Fee", id: "LIST" },
      ],
    }),

    deleteFee: build.mutation<void, string>({
      query: (infId) => ({
        url: `/invoice/fees/${infId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, infId) => [
        { type: "Fee", id: infId },
        { type: "Fee", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateFeeMutation,
  useGetAllFeesQuery,
  useGetFeeByIdQuery,
  useUpdateFeeMutation,
  useDeleteFeeMutation,
} = feeAPI;
