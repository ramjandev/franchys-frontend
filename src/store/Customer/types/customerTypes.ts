import {
  ApiResponse,
  PaginatedApiResponse,
} from "@/store/Auth/types/authTypes";

export type CustomerType = "PERSONAL" | "BUSINESS";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string | null;
  website: string | null;
  companyName: string | null;
  taxId: string | null;
  secondaryEmail: string | null;
  secondaryPhone: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  tags: string[];
  notes: string | null;
  customerType: CustomerType;
  orderPurpose: string | null;
  eventType: string | null;
  eventDate: string | null;
  profileImage: string | null;
  isDeleted: boolean;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
  orders: number;
  totalSpent: number;
}

// ---- Request payloads ----

export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language?: string;
  website?: string;
  companyName?: string;
  taxId?: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  tags?: string[];
  notes?: string;
  customerType: CustomerType;
  orderPurpose?: string;
  eventType?: string;
  eventDate?: string;
  profileImage?: File;
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

export interface GetCustomersParams {
  search?: string;
  page?: number;
  limit?: number;
  customerType?: CustomerType;
}

// ---- Response envelopes ----

export type GetAllCustomersResponse = PaginatedApiResponse<Customer[]>;
export type GetCustomerResponse = ApiResponse<Customer>;
export type CreateCustomerResponse = ApiResponse<Customer>;
export type UpdateCustomerResponse = ApiResponse<Customer>;
