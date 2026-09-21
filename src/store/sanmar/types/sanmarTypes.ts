import { ApiResponse } from "@/store/Auth/types/authTypes";

export interface SanmarProductAutocompleteItem {
  label: string;
  productId: string;
  productName: string;
  itemNo: string;
  style: string;
  price: number;
  unitPrice: number;
  casePrice: number;
  brandId: string | null;
  brandName: string;
  categoryId: string | null;
  categoryName: string;
  colorId: string | null;
  color: string;
  colorCode: string | null;
  availableSizes: string[];
  material: string;
  images: string[];
}

export interface SanmarAutocompleteParams {
  search?: string;
}

export type SanmarProductAutocompleteResponse = ApiResponse<
  SanmarProductAutocompleteItem[]
>;

export interface SanmarSyncSftpResponseData {
  [key: string]: any;
}

export type SanmarSyncSftpResponse = ApiResponse<SanmarSyncSftpResponseData>;
