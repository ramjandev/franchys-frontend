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

    getAllCustomers: build.query<
      GetAllCustomersResponse,
      GetCustomersParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        if (params?.search) queryParams.search = params.search;
        if (params?.customerType)
          queryParams.customerType = params.customerType;
        if (params?.sortBy) queryParams.sortBy = params.sortBy;
        if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

        return {
          url: "/customer",
          method: "GET",
          params: queryParams,
        };
      },
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
