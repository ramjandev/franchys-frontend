import { baseAPI } from "../BaseApi/baseAPI";
import {
  CreateCustomerRequest,
  CreateCustomerResponse,
  GetAllCustomersResponse,
  GetCustomerResponse,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
} from "./types/customerTypes";

export const customerAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createCustomer: build.mutation<
      CreateCustomerResponse,
      CreateCustomerRequest
    >({
      query: (data) => ({
        url: "/customer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),

    getAllCustomers: build.query<GetAllCustomersResponse, void>({
      query: () => ({
        url: "/customer",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Customer" as const,
                id,
              })),
              { type: "Customer" as const, id: "LIST" },
            ]
          : [{ type: "Customer" as const, id: "LIST" }],
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
      UpdateCustomerRequest
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
