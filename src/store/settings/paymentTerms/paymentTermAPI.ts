import { baseAPI } from "@/store/BaseApi/baseAPI";
import {
  CreatePaymentTermPayload,
  CreatePaymentTermResponse,
  GetPaymentTermByIdResponse,
  GetPaymentTermsResponse,
  UpdatePaymentTermPayload,
  UpdatePaymentTermResponse,
} from "./types/paymentTermTypes";

export const paymentTermAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createPaymentTerm: build.mutation<
      CreatePaymentTermResponse,
      CreatePaymentTermPayload
    >({
      query: (data) => ({
        url: `/invoice/payment-terms`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentTerm"],
    }),

    getPaymentTerms: build.query<GetPaymentTermsResponse, void>({
      query: () => ({
        url: `/invoice/payment-terms`,
        method: "GET",
      }),
      providesTags: ["PaymentTerm"],
    }),

    getPaymentTermById: build.query<GetPaymentTermByIdResponse, string>({
      query: (id) => ({
        url: `/invoice/payment-terms/${id}`,
        method: "GET",
      }),
      providesTags: ["PaymentTerm"],
    }),

    updatePaymentTerm: build.mutation<
      UpdatePaymentTermResponse,
      { id: string; data: UpdatePaymentTermPayload }
    >({
      query: ({ id, data }) => ({
        url: `/invoice/payment-terms/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PaymentTerm"],
    }),

    deletePaymentTerm: build.mutation<void, string>({
      query: (id) => ({
        url: `/invoice/payment-terms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentTerm"],
    }),
  }),
});

export const {
  useCreatePaymentTermMutation,
  useGetPaymentTermsQuery,
  useGetPaymentTermByIdQuery,
  useUpdatePaymentTermMutation,
  useDeletePaymentTermMutation,
} = paymentTermAPI;
