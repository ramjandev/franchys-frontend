import { baseAPI } from "@/store/BaseApi/baseAPI";
import {
  CreatePriceMatrix,
  CreatePriceTierPayload,
  CreatePriceTierResponse,
  GetPriceMatrixByIdResponse,
  GetPriceMatrixResponse,
  UpdatePriceMatrix,
  UpdatePriceTier,
} from "./types/priceMatrixTypes";
export const priceMatrixAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createPriceMatrix: build.mutation<void, CreatePriceMatrix>({
      query: (data) => ({
        url: `/price-matrics`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PriceMatrix"],
    }),
    updatePriceMatrix: build.mutation<
      void,
      { id: string; data: UpdatePriceMatrix }
    >({
      query: ({ data, id }) => ({
        url: `/price-matrics/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PriceMatrix"],
    }),
    deletePriceMatrix: build.mutation<void, string>({
      query: (id) => ({
        url: `/price-matrics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PriceMatrix"],
    }),
    getPriceMatrix: build.query<GetPriceMatrixResponse, void>({
      query: () => ({
        url: `/price-matrics`,
        method: "GET",
      }),
      providesTags: ["PriceMatrix"],
    }),
    getPriceMatrixById: build.query<GetPriceMatrixByIdResponse, string>({
      query: (id) => ({
        url: `/price-matrics/${id}`,
        method: "GET",
      }),
      providesTags: ["PriceMatrix"],
    }),

    createPriceTier: build.mutation<
      CreatePriceTierResponse,
      {
        priceMatrixId: string;
        data: CreatePriceTierPayload;
      }
    >({
      query: ({ priceMatrixId, data }) => ({
        url: `/price-matrics/${priceMatrixId}/tiers`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PriceMatrix"],
    }),

    updatePriceTier: build.mutation<
      void,
      { priceMatrixId: string; priceTierId: string; data: UpdatePriceTier }
    >({
      query: ({ priceMatrixId, priceTierId, data }) => ({
        url: `/price-matrics/${priceMatrixId}/tiers/${priceTierId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PriceMatrix"],
    }),
    deletePriceTier: build.mutation<
      void,
      { priceMatrixId: string; priceTierId: string }
    >({
      query: ({ priceMatrixId, priceTierId }) => ({
        url: `/price-matrics/${priceMatrixId}/tiers/${priceTierId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PriceMatrix"],
    }),
  }),
});

export const {
  useCreatePriceMatrixMutation,
  useUpdatePriceMatrixMutation,
  useDeletePriceMatrixMutation,
  useGetPriceMatrixQuery,
  useGetPriceMatrixByIdQuery,
  useUpdatePriceTierMutation,
  useCreatePriceTierMutation,
  useDeletePriceTierMutation,
} = priceMatrixAPI;
