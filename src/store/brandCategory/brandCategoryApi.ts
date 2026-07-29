import { baseAPI } from "@/store/BaseApi/baseAPI";
import {
  CreateBrand,
  CreateBrandResponse,
  CreateCategory,
  CreateCategoryResponse,
  GetBrandByIdResponse,
  GetBrandsParams,
  GetBrandsResponse,
  GetCategoriesParams,
  GetCategoriesResponse,
  GetCategoryByIdResponse,
  UpdateBrand,
  UpdateBrandResponse,
  UpdateCategory,
  UpdateCategoryResponse,
} from "./types/brandCategoryTypes";
export const brandCategoryApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createBrand: build.mutation<CreateBrandResponse, CreateBrand>({
      query: (data) => ({
        url: `/brand`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),
    getBrands: build.query<GetBrandsResponse, GetBrandsParams>({
      query: (params) => ({
        url: `/brand`,
        method: "GET",
        params,
      }),
      providesTags: ["Brand"],
    }),
    getBrandById: build.query<GetBrandByIdResponse, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "GET",
      }),
      providesTags: ["Brand"],
    }),
    updateBrand: build.mutation<
      UpdateBrandResponse,
      { id: string; data: UpdateBrand }
    >({
      query: ({ id, data }) => ({
        url: `/brand/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),
    deleteBrand: build.mutation<void, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),

    // category

    createCategory: build.mutation<CreateCategoryResponse, CreateCategory>({
      query: (data) => ({
        url: `/category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    getCategories: build.query<GetCategoriesResponse, GetCategoriesParams>({
      query: (params) => ({
        url: `/category`,
        method: "GET",
        params,
      }),
      providesTags: ["Category"],
    }),
    getCategoryById: build.query<GetCategoryByIdResponse, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    updateCategory: build.mutation<
      UpdateCategoryResponse,
      { id: string; data: UpdateCategory }
    >({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: build.mutation<void, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  // brand
  useCreateBrandMutation,
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  // category
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = brandCategoryApi;
