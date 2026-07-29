import { baseAPI } from "@/store/BaseApi/baseAPI";
import {
  GetInvoiceInformationResponse,
  UpdateInvoiceInformationPayload,
  UpdateInvoiceInformationResponse,
} from "./types/invoiceInformationTypes";

export const invoiceInformationAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getInvoiceInformation: build.query<GetInvoiceInformationResponse, void>({
      query: () => ({
        url: `/invoice/information`,
        method: "GET",
      }),
      providesTags: ["InvoiceInformation"],
    }),

    updateInvoiceInformation: build.mutation<
      UpdateInvoiceInformationResponse,
      UpdateInvoiceInformationPayload
    >({
      query: (data) => ({
        url: `/invoice/information`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["InvoiceInformation"],
    }),
  }),
});

export const {
  useGetInvoiceInformationQuery,
  useUpdateInvoiceInformationMutation,
} = invoiceInformationAPI;
