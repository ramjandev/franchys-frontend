import { baseAPI } from "@/store/BaseApi/baseAPI";
import {
  CreateVendor,
  CreateVendorResponse,
  GetVendorByIdResponse,
  GetVendorsParams,
  GetVendorsResponse,
  UpdateVendor,
  UpdateVendorResponse,
  UpdateVendorStatus,
} from "./types/vendorTypes";

export const vendorAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createVendor: build.mutation<CreateVendorResponse, CreateVendor>({
      query: (data) => ({
        url: `/vendors`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vendor"],
    }),
    getVendors: build.query<GetVendorsResponse, GetVendorsParams>({
      query: (params) => ({
        url: `/vendors`,
        method: "GET",
        params,
      }),
      providesTags: ["Vendor"],
    }),
    getVendorById: build.query<GetVendorByIdResponse, string>({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: "GET",
      }),
      providesTags: ["Vendor"],
    }),
    updateVendor: build.mutation<
      UpdateVendorResponse,
      { id: string; data: UpdateVendor }
    >({
      query: ({ id, data }) => ({
        url: `/vendors/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Vendor"],
    }),
    deleteVendor: build.mutation<void, string>({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vendor"],
    }),
    updateVendorStatus: build.mutation<
      UpdateVendorResponse,
      { id: string; data: UpdateVendorStatus }
    >({
      query: ({ id, data }) => ({
        url: `/vendors/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Vendor"],
    }),
  }),
});

export const {
  useCreateVendorMutation,
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
  useUpdateVendorStatusMutation,
} = vendorAPI;
