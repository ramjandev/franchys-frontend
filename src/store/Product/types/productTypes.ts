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

// ---- System Product Entity ----

export interface SystemProductDetail {
  id: string;
  productName: string;
  itemNo: string;
  price: string;
  material: string | null;
  weight: number;
  style: string | null;
  images: string[];
  availableSizes: string[];
  isDeleted: boolean;
  categoryId: string | null;
  brandId: string;
  createdAt: string;
  updatedAt: string;
  colors: ProductColor[];
  category: Category | null;
  brand: Brand | null;
  isSanMar?: false;
}

// Backward compatibility alias
export type Product = SystemProductDetail;

// ---- SanMar Product Entity ----

export interface SanMarProductDetail {
  productId: string;
  isSanMar: true;
  style: string;
  inventoryKey: string;
  productName: string;
  colorName?: string;
  colorCode?: string;
  brand?: string;
  category?: string;
  subCategory?: string;
  piecePrice?: number;
  casePrice?: number;
  salePrice?: number;
  description?: string;
  primaryImageUrl?: string;
  colorSquareUrl?: string;
  images: string[];
  availableSizes: string[];
}

// ---- Discriminated Union for Single Product (GET /product/:id) ----

export type SingleProduct = SystemProductDetail | SanMarProductDetail;

// Type guards
export function isSanMarProduct(
  product: SingleProduct | undefined | null,
): product is SanMarProductDetail {
  return Boolean(product && "isSanMar" in product && product.isSanMar === true);
}

export function isSystemProduct(
  product: SingleProduct | undefined | null,
): product is SystemProductDetail {
  return Boolean(product && !isSanMarProduct(product));
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
export type GetProductByIdResponse = ApiResponse<SingleProduct>;
export type SingleProductResponse = ApiResponse<SingleProduct>;
export type CreateProductResponse = ApiResponse<Product>;
export type UpdateProductResponse = ApiResponse<Product>;

export type GetProductColorsResponse = ApiResponse<ProductColor[]>;
export type CreateProductColorsResponse = ApiResponse<ProductColor[]>;
export type UpdateProductColorResponse = ApiResponse<ProductColor>;
export type ProductAutocompleteResponse = ApiResponse<
  ProductAutocompleteItem[]
>;
