import { baseAPI } from "../BaseApi/baseAPI";
import {
  CreateColorPayload,
  CreateProductColorsResponse,
  GetProductByIdResponse,
  GetProductColorsResponse,
  GetProductsParams,
  GetProductsResponse,
  ProductAutocompleteResponse,
  UpdateColorPayload,
  UpdateProductColorResponse,
  UpdateProductResponse,
} from "./types/productTypes";

export const productAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createProduct: build.mutation<void, FormData>({
      query: (data) => ({
        url: `/product`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getProducts: build.query<GetProductsResponse, GetProductsParams>({
      query: (params) => ({
        url: `/product`,
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),
    getProductsForAutoComplete: build.query<
      ProductAutocompleteResponse,
      { search?: string }
    >({
      query: (params) => ({
        url: `/product/autocomplete`,
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),
    getProductById: build.query<GetProductByIdResponse, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    updateProduct: build.mutation<
      UpdateProductResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: build.mutation<void, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    createProductColors: build.mutation<
      CreateProductColorsResponse,
      { productId: string; data: CreateColorPayload[] }
    >({
      query: ({ productId, data }) => ({
        url: `/product/${productId}/colors`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getProductColors: build.query<GetProductColorsResponse, string>({
      query: (productId) => ({
        url: `/product/${productId}/colors`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    updateProductColor: build.mutation<
      UpdateProductColorResponse,
      { productId: string; colorId: string; data: UpdateColorPayload }
    >({
      query: ({ productId, colorId, data }) => ({
        url: `/product/${productId}/colors/${colorId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProductColor: build.mutation<
      void,
      { productId: string; colorId: string }
    >({
      query: ({ productId, colorId }) => ({
        url: `/product/${productId}/colors/${colorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  // ---- Product ----
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductsForAutoCompleteQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  // ---- Colors ----
  useCreateProductColorsMutation,
  useGetProductColorsQuery,
  useUpdateProductColorMutation,
  useDeleteProductColorMutation,
} = productAPI;
