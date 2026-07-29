import { baseAPI } from "../BaseApi/baseAPI";
import {
  CreateCustomerResponse,
  GetAllCustomersResponse,
  GetCustomerResponse,
  GetCustomersParams,
  UpdateCustomerResponse,
} from "./types/customerTypes";

export const customerAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createCustomer: build.mutation<CreateCustomerResponse, FormData>({
      query: (data) => ({
        url: "/customer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),

    getAllCustomers: build.query<GetAllCustomersResponse, GetCustomersParams>({
      query: (params) => ({
        url: "/customer",
        method: "GET",
        params,
      }),
      providesTags: ["Customer"],
    }),

    getCustomerById: build.query<GetCustomerResponse, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Customer", id }],
    }),

    updateCustomer: build.mutation<
      UpdateCustomerResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, ...data }) => ({
        url: `/customer/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),

    deleteCustomer: build.mutation<void, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerAPI;
