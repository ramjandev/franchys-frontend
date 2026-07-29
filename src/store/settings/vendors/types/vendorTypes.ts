// ---- Core entity ----

import {
  ApiResponse,
  PaginatedApiResponse,
} from "@/store/Auth/types/authTypes";

export type VendorStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export interface Vendor {
  vendorId: string;
  companyName: string;
  contactName: string;
  avatar: string | null;
  status: VendorStatus;
  email: string;
  phone: string;
  fax: string;
  accountNumber: string;
  mainAddress: string;
  optionalAddress: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  updatedAt: string;
  createAt: string;
  isDeleted: boolean;
}

// ---- Request payloads ----

export interface CreateVendor {
  companyName: string;
  contactName: string;
  status: VendorStatus;
  email: string;
  phone: string;
  fax?: string;
  accountNumber?: string;
  mainAddress: string;
  optionalAddress?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export type UpdateVendor = Partial<CreateVendor>;

export interface UpdateVendorStatus {
  status: VendorStatus;
}

export interface GetVendorsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export type GetVendorsResponse = PaginatedApiResponse<Vendor[]>;
export type GetVendorByIdResponse = ApiResponse<Vendor>;
export type CreateVendorResponse = ApiResponse<Vendor>;
export type UpdateVendorResponse = ApiResponse<Vendor>;
