import { ApiResponse } from "@/store/Auth/types/authTypes";

// ---- Core entity ----

export type CampaignType = "DISCOUNT" | "PROMOTION" | "NEWSLETTER";
export type CampaignStatus = "DRAFT" | "SENT";
export type DiscountType = "percentage" | "fixed";

export interface Campaign {
  id: string;
  title: string;
  type: CampaignType;
  status: CampaignStatus;
  recipientsCount: number;
  targetAudience: string;
  promoCode: string;
  discountType: DiscountType;
  percentage: string;
  minOrderAmount: string;
  usageLimit: number;
  startDate: string;
  endDate: string;
  termsCondition: string;
  featuredProducts: string[];
  createdAt: string;
  updatedAt: string;
}

// ---- Request payloads ----

export interface CreateCampaign {
  title: string;
  type: CampaignType;
  status: CampaignStatus;
  recipientsCount: number;
  targetAudience: string;
  promoCode: string;
  discountType: DiscountType;
  percentage: string;
  minOrderAmount: string;
  usageLimit: number;
  startDate: string;
  endDate: string;
  termsCondition: string;
  featuredProducts: string[];
}

export type UpdateCampaign = Partial<CreateCampaign>;

export interface ValidateCampaignCodePayload {
  code: string;
  orderAmount: number;
  customerId: string;
}

export interface ValidateCampaignCodeResult {
  valid: boolean;
  discountType?: DiscountType;
  discountAmount?: number;
  message?: string;
}

// ---- Response envelopes ----

export type GetCampaignsResponse = ApiResponse<Campaign[]>;
export type GetCampaignByIdResponse = ApiResponse<Campaign>;
export type CreateCampaignResponse = ApiResponse<Campaign>;
export type UpdateCampaignResponse = ApiResponse<Campaign>;
export type ValidateCampaignCodeResponse =
  ApiResponse<ValidateCampaignCodeResult>;
export type SendCampaignResponse = ApiResponse<Campaign>;
