// ---- Brand ----

import {
  ApiResponse,
  PaginatedApiResponse,
} from "@/store/Auth/types/authTypes";

export interface Brand {
  id: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrand {
  name: string;
  description: string;
}

export type UpdateBrand = Partial<CreateBrand>;

export interface GetBrandsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export type GetBrandsResponse = PaginatedApiResponse<Brand[]>;
export type GetBrandByIdResponse = ApiResponse<Brand>;
export type CreateBrandResponse = ApiResponse<Brand>;
export type UpdateBrandResponse = ApiResponse<Brand>;

// ---- Category ----

export interface Category {
  id: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategory {
  name: string;
  description: string;
}

export type UpdateCategory = Partial<CreateCategory>;

export interface GetCategoriesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export type GetCategoriesResponse = PaginatedApiResponse<Category[]>;
export type GetCategoryByIdResponse = ApiResponse<Category>;
export type CreateCategoryResponse = ApiResponse<Category>;
export type UpdateCategoryResponse = ApiResponse<Category>;
