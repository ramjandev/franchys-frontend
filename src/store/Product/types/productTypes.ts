// ---- Color ----

import {
  ApiResponse,
  PaginatedApiResponse,
} from "@/store/Auth/types/authTypes";
import {
  Brand,
  Category,
} from "@/store/brandCategory/types/brandCategoryTypes";

export interface ProductColor {
  id: string;
  name: string;
  code: string;
  productId: string;
}

export interface CreateColorPayload {
  name: string;
  code: string;
}

export type UpdateColorPayload = Partial<CreateColorPayload>;

// ---- Product ----

export interface Product {
  id: string;
  productName: string;
  itemNo: string;
  price: string;
  material: string;
  weight: number;
  style: string;
  images: string[];
  availableSizes: string[];
  isDeleted: boolean;
  categoryId: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
  colors: ProductColor[];
  category: Category;
  brand: Brand;
}

// ---- Create/Update payload (multipart/form-data) ----

export interface CreateProductPayload {
  productName: string;
  categoryId?: string; // UUID or "other"
  categoryName?: string;
  brandId?: string; // UUID or "other"
  brandName?: string;
  price: number;
  itemNo?: string;
  material?: string;
  weight?: number;
  style?: string;
  images?: File[];
  availableSizes?: string[];
  colors?: { name: string; code: string }[];
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface GetProductsParams {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
  color?: string;
  size?: string;
}

export interface ProductAutocompleteItem {
  label: string;
  productId: string;
  productName: string;
  itemNo: string;
  style: string;
  price: string;
  unitPrice: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  colorId: string | null;
  color: string | null;
  colorCode: string | null;
  availableSizes: string[];
  images: string[];
}

// ---- Response envelopes ----

export type GetProductsResponse = PaginatedApiResponse<Product[]>;
export type GetProductByIdResponse = ApiResponse<Product>;
export type CreateProductResponse = ApiResponse<Product>;
export type UpdateProductResponse = ApiResponse<Product>;

export type GetProductColorsResponse = ApiResponse<ProductColor[]>;
export type CreateProductColorsResponse = ApiResponse<ProductColor[]>;
export type UpdateProductColorResponse = ApiResponse<ProductColor>;
export type ProductAutocompleteResponse = ApiResponse<
  ProductAutocompleteItem[]
>;
