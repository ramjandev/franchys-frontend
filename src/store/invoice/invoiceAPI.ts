import { baseAPI } from "../BaseApi/baseAPI";
import {
  CreateInvoicePayload,
  CreateInvoiceResponse,
  GetInvoiceByIdResponse,
  GetInvoicesParams,
  GetInvoicesResponse,
  GetInvoicesSummaryResponse,
  GetPaymentSummaryResponse,
  PaymentHistoryResponse,
  SendInvoicePayload,
  SendInvoiceReminderResponse,
  SendInvoiceResponse,
  UpdateInvoiceResponse,
} from "./types/invoiceTypes";

export const invoiceAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createInvoice: build.mutation<CreateInvoiceResponse, CreateInvoicePayload>({
      query: (data) => ({
        url: `/invoices`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invoice"],
    }),

    getInvoices: build.query<GetInvoicesResponse, GetInvoicesParams>({
      query: (params) => ({
        url: `/invoices`,
        method: "GET",
        params,
      }),
      providesTags: ["Invoice"],
    }),
    getInvoiceSummary: build.query<GetInvoicesSummaryResponse, void>({
      query: () => ({
        url: `/invoices/summary`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),
    getPaymentSummary: build.query<GetPaymentSummaryResponse, void>({
      query: () => ({
        url: `/invoices/payments/summary`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),
    getTransactionSummary: build.query<PaymentHistoryResponse, void>({
      query: () => ({
        url: `/invoices/payments`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),

    getInvoiceById: build.query<GetInvoiceByIdResponse, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),

    updateInvoice: build.mutation<
      UpdateInvoiceResponse,
      { id: string; data: { paymentTermId: string } }
    >({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Invoice"],
    }),

    sendInvoice: build.mutation<
      SendInvoiceResponse,
      { id: string; data: SendInvoicePayload }
    >({
      query: ({ id, data }) => ({
        url: `/invoices/${id}/send`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invoice"],
    }),

    sendInvoiceReminder: build.mutation<SendInvoiceReminderResponse, string>({
      query: (id) => ({
        url: `/invoices/${id}/send-reminder`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Invoice"],
    }),

    deleteInvoice: build.mutation<void, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useGetInvoicesQuery,
  useGetInvoiceSummaryQuery,
  useGetPaymentSummaryQuery,
  useGetTransactionSummaryQuery,
  useGetInvoiceByIdQuery,
  useUpdateInvoiceMutation,
  useSendInvoiceMutation,
  useSendInvoiceReminderMutation,
  useDeleteInvoiceMutation,
} = invoiceAPI;
