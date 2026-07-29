import { baseAPI } from "@/store/BaseApi/baseAPI";
import {
  GetLineItemCustomizationResponse,
  GetSelectedSizesResponse,
  UpdateLineItemCustomizationPayload,
  UpdateLineItemCustomizationResponse,
} from "./types/lineItemCustomizationTypes";

export const lineItemCustomizationAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getLineItemCustomization: build.query<
      GetLineItemCustomizationResponse,
      void
    >({
      query: () => ({
        url: `/line-item-customization`,
        method: "GET",
      }),
      providesTags: ["LineItemCustomization"],
    }),

    updateLineItemCustomization: build.mutation<
      UpdateLineItemCustomizationResponse,
      UpdateLineItemCustomizationPayload
    >({
      query: (data) => ({
        url: `/line-item-customization`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["LineItemCustomization"],
    }),

    getSelectedSizes: build.query<GetSelectedSizesResponse, void>({
      query: () => ({
        url: `/line-item-customization/selected-sizes`,
        method: "GET",
      }),
      providesTags: ["LineItemCustomization"],
    }),
  }),
});

export const {
  useGetLineItemCustomizationQuery,
  useUpdateLineItemCustomizationMutation,
  useGetSelectedSizesQuery,
} = lineItemCustomizationAPI;
