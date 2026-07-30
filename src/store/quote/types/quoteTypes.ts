import {
  ApiResponse,
  PaginatedApiResponse,
} from "@/store/Auth/types/authTypes";

// ---- Line item ----

export type ImprintType =
  | "Screen Print"
  | "Embroidery"
  | "DTG"
  | "Heat Transfer"
  | "Digital Printing"
  | string;

// Dynamic size map — keys are whatever size labels are in use
// (e.g. "sizeAdultS", "sizeYouthL", "sizeToddler2T"), values are quantities.
export type SizeBreakdown = Record<string, number>;

export interface QuoteLineItemPayload {
  groupName: string;
  category: string;
  itemNumber: string;
  color: string;
  description: string;
  baseCost: number;
  sizeBreakdown: SizeBreakdown;
  markupPrice?: number;
  matrixId?: string;
  printCost?: number;
  unitPrice: number;
  isTaxed: boolean;
  total: number;
  imprintType: ImprintType;
  mockups?: string[];
}

export interface QuoteLineItem {
  id: string;
  quoteId: string;
  groupName: string;
  category: string;
  itemNumber: string;
  color: string;
  description: string;
  baseCost: string;
  sizeBreakdown: SizeBreakdown;
  itemsCount: number;
  markupPrice: string;
  matrixId: string | null;
  printCost: string;
  unitPrice: string;
  isTaxed: boolean;
  total: string;
  imprintType: ImprintType;
  mockups: string[];
}

export interface QuoteGroupPayload {
  name: string;
  lineItems: QuoteLineItemPayload[];
}

export interface QuoteGroup {
  name: string;
  lineItems: QuoteLineItem[];
}

// ---- Quote ----

export type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "APPROVED"
  | "DECLINED"
  | "REVISION_REQUESTED"
  | string;

export interface QuoteCustomer {
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
  customerType: "BUSINESS" | "PERSONAL" | string;
  orderPurpose: string | null;
  eventType: string | null;
  eventDate: string | null;
  profileImage: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRep {
  userId: string;
  email: string;
  name: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  repId: string;
  poNumber: string;
  deliveryMethod: string;
  dueDate: string;
  status: QuoteStatus;
  subtotal: string;
  discount: string;
  taxRate: string;
  taxAmount: string;
  total: string;
  notes: string;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  lineItems: QuoteLineItem[]; // flat list — same items also nested under groups
  groups: QuoteGroup[];
  customer: QuoteCustomer;
  rep?: QuoteRep; // present on getQuoteById/public, absent on list
}

// ---- Request payloads ----

export interface CreateQuotePayload {
  customerId: string;
  repId: string;
  poNumber: string;
  deliveryMethod: string;
  dueDate: string;
  status: QuoteStatus;
  discount: number;
  taxRate: number;
  total: number;
  notes: string;
  groups: QuoteGroupPayload[];
}

export type UpdateQuotePayload = CreateQuotePayload;

export interface GetQuotesParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
}

// ---- Refresh pricing payloads ----

export interface RefreshPricingNewPayload {
  discount: number;
  taxRate: number;
  total: number;
  groups: QuoteGroupPayload[];
}

export type RefreshPricingExistingPayload = CreateQuotePayload;

export interface RefreshPricingResult {
  subtotal: string;
  discount: string;
  taxRate: string;
  taxAmount: string;
  total: string;
  groups: QuoteGroup[];
}

// ---- Upload mockups payload ----

export interface UploadMockupsPayload {
  files: File[];
}

interface UploadUrlsData {
  urls: string[];
}

export type UploadQuoteMockupResponse = ApiResponse<UploadUrlsData>;

// ---- Response envelopes ----

export type GetQuotesResponse = PaginatedApiResponse<Quote[]>;
export type GetQuoteByIdResponse = ApiResponse<Quote>;
export type CreateQuoteResponse = ApiResponse<Quote>;
export type UpdateQuoteResponse = ApiResponse<Quote>;
export type QuoteActionResponse = ApiResponse<Quote>;
export type RefreshPricingResponse = ApiResponse<RefreshPricingResult>;
export type UploadMockupsResponse = ApiResponse<UploadUrlsData>;
