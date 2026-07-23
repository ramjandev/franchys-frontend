import { baseAPI } from "@/store/BaseApi/baseAPI";
import {
  CreateAdmin,
  CreateAdminResponse,
  GetAdminParams,
  GetAdminResponse,
  UpdateAdmin,
  UpdateAdminResponse,
} from "./types/userAdminTypes";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createAdmin: build.mutation<CreateAdminResponse, CreateAdmin>({
      query: (data) => ({
        url: `/users/admin`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
    updateAdmin: build.mutation<
      UpdateAdminResponse,
      { id: string; data: UpdateAdmin }
    >({
      query: ({ data, id }) => ({
        url: `/users/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
    deleteAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/users/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    restoreAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/users/admin/${id}/restore`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Admin"],
    }),
    banAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/users/admin/${id}/ban`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Admin"],
    }),
    getAdmin: build.query<GetAdminResponse, GetAdminParams | void>({
      query: (params) => ({
        url: `/users/admin`,
        method: "GET",
        params: {
          search: params?.search,
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useRestoreAdminMutation,
  useBanAdminMutation,
  useGetAdminQuery,
} = userAPI;
