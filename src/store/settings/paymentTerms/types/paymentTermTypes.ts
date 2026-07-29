import { ApiResponse } from "@/store/Auth/types/authTypes";

export interface PaymentTerm {
  id: string;
  name: string;
  paymentDaysAllowed: number;
  depositPercent: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentTermPayload {
  name: string;
  paymentDaysAllowed: number;
  depositPercent: number;
}

export interface UpdatePaymentTermPayload {
  name?: string;
  paymentDaysAllowed?: number;
  depositPercent?: number;
  isArchived?: boolean;
}

export type GetPaymentTermsResponse = ApiResponse<PaymentTerm[]>;
export type GetPaymentTermByIdResponse = ApiResponse<PaymentTerm>;
export type CreatePaymentTermResponse = ApiResponse<PaymentTerm>;
export type UpdatePaymentTermResponse = ApiResponse<PaymentTerm>;
