// ---- Core entities ----

import { ApiResponse } from "@/store/Auth/types/authTypes";

export interface PriceTier {
  priceTierId?: string;
  quantity: number;
  basePrice?: number | string;
  markup: number | string;
  columnPrices?: Record<string, number | string> | null;
  priceMatrixId?: string;
  updatedAt?: string;
  createAt?: string;
}

export interface PriceMatrix {
  priceMatrixId: string;
  name: string;
  priceType: "percentage" | "fixed";
  columns?: string[];
  priceTiers: PriceTier[];
}

// ---- Request payloads ----

export interface CreatePriceTierPayload {
  quantity: number;
  basePrice?: number | string;
  markup: number | string;
  columnPrices?: Record<string, number | string>;
}

export interface CreatePriceMatrix {
  name: string;
  priceType: "percentage" | "fixed";
  columns?: string[];
  priceTiers: CreatePriceTierPayload[];
}

export type UpdatePriceMatrix = Partial<CreatePriceMatrix>;

export interface UpdatePriceTier {
  quantity?: number;
  basePrice?: number | string;
  markup?: number | string;
  columnPrices?: Record<string, number | string>;
}

export type GetPriceMatrixResponse = ApiResponse<PriceMatrix[]>;
export type GetPriceMatrixByIdResponse = ApiResponse<PriceMatrix>;
export type CreatePriceTierResponse = ApiResponse<PriceTier>;
export type UpdatePriceTierResponse = ApiResponse<PriceTier>;
