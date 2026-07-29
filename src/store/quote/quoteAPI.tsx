import { baseAPI } from "../BaseApi/baseAPI";
import {
  CreateQuotePayload,
  CreateQuoteResponse,
  GetQuoteByIdResponse,
  GetQuotesParams,
  GetQuotesResponse,
  QuoteActionResponse,
  RefreshPricingExistingPayload,
  RefreshPricingNewPayload,
  RefreshPricingResponse,
  UpdateQuotePayload,
  UpdateQuoteResponse,
  UploadMockupsResponse,
} from "./types/quoteTypes";

export const quoteAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createQuote: build.mutation<CreateQuoteResponse, CreateQuotePayload>({
      query: (data) => ({
        url: `/quote`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quote"],
    }),

    getQuotes: build.query<GetQuotesResponse, GetQuotesParams>({
      query: (params) => ({
        url: `/quote`,
        method: "GET",
        params,
      }),
      providesTags: ["Quote"],
    }),

    getQuoteById: build.query<GetQuoteByIdResponse, string>({
      query: (id) => ({
        url: `/quote/${id}`,
        method: "GET",
      }),
      providesTags: ["Quote"],
    }),

    getPublicQuote: build.query<GetQuoteByIdResponse, string>({
      query: (id) => ({
        url: `/quote/${id}/public`,
        method: "GET",
      }),
      providesTags: ["Quote"],
    }),

    updateQuote: build.mutation<
      UpdateQuoteResponse,
      { id: string; data: UpdateQuotePayload }
    >({
      query: ({ id, data }) => ({
        url: `/quote/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Quote"],
    }),

    deleteQuote: build.mutation<void, string>({
      query: (id) => ({
        url: `/quote/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quote"],
    }),

    approveQuote: build.mutation<QuoteActionResponse, string>({
      query: (id) => ({
        url: `/quote/${id}/public/approve`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Quote"],
    }),

    requestQuoteRevision: build.mutation<
      QuoteActionResponse,
      { id: string; data: { notes: string } }
    >({
      query: ({ id, data }) => ({
        url: `/quote/${id}/public/request-revision`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quote"],
    }),

    declineQuote: build.mutation<QuoteActionResponse, string>({
      query: (id) => ({
        url: `/quote/${id}/public/decline`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Quote"],
    }),

    sendQuoteEmail: build.mutation<QuoteActionResponse, string>({
      query: (id) => ({
        url: `/quote/${id}/send-email`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Quote"],
    }),

    sendQuoteWhatsapp: build.mutation<QuoteActionResponse, string>({
      query: (id) => ({
        url: `/quote/${id}/send-whatsapp`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Quote"],
    }),

    // Recalculates pricing for a quote that doesn't exist yet (create flow)
    refreshPricingNew: build.mutation<
      RefreshPricingResponse,
      RefreshPricingNewPayload
    >({
      query: (data) => ({
        url: `/quote/refresh-pricing/new`,
        method: "POST",
        body: data,
      }),
    }),

    // Recalculates pricing for an existing quote (edit flow)
    refreshPricingExisting: build.mutation<
      RefreshPricingResponse,
      { id: string; data: RefreshPricingExistingPayload }
    >({
      query: ({ id, data }) => ({
        url: `/quote/${id}/refresh-pricing/existing`,
        method: "POST",
        body: data,
      }),
    }),

    // Uploads mockup images, returns hosted URLs to attach to line items
    uploadMockups: build.mutation<UploadMockupsResponse, File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        return {
          url: `/quote/upload-mockups`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useCreateQuoteMutation,
  useGetQuotesQuery,
  useGetQuoteByIdQuery,
  useGetPublicQuoteQuery,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
  // Quote status
  useApproveQuoteMutation,
  useRequestQuoteRevisionMutation,
  useDeclineQuoteMutation,

  // Quote actions
  useSendQuoteEmailMutation,
  useSendQuoteWhatsappMutation,
  // Recalculates pricing
  useRefreshPricingNewMutation,
  useRefreshPricingExistingMutation,
  // Upload mockups
  useUploadMockupsMutation,
} = quoteAPI;
