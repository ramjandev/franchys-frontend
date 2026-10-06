// ---- Line item ----

import {
  ApiResponse,
  PaginatedApiResponse,
} from "@/store/Auth/types/authTypes";

export interface InvoiceLineItemPayload {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
  createdAt: string;
}

// ---- Nested quote/customer summaries (list view) ----

export interface InvoiceCustomerSummary {
  id: string;
  firstName: string;
  lastName?: string | null;
  companyName: string | null;
  email: string;
}

export interface InvoiceQuoteSummary {
  quoteNumber: string;
  status: string;
}

// ---- Nested quote (single-invoice view — includes its own line items) ----

export interface InvoiceQuoteLineItem {
  id: string;
  quoteId: string;
  groupName: string;
  category: string;
  itemNumber: string;
  color: string;
  description: string;
  baseCost: string;
  sizeBreakdown: Record<string, number>;
  itemsCount: number;
  markupPrice: string;
  matrixId: string | null;
  printCost: string;
  unitPrice: string;
  isTaxed: boolean;
  total: string;
  imprintType: string;
  mockups: string[];
}

export interface InvoiceQuoteDetail {
  quoteNumber: string;
  status: string;
  lineItems: InvoiceQuoteLineItem[];
}

// ---- Customer (full, on single-invoice view) ----

export interface InvoiceCustomerDetail {
  id: string;
  firstName: string;
  lastName?: string | null;
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
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Payment term / installments / payments (shapes unconfirmed — placeholders) ----

export interface InvoicePaymentTerm {
  [key: string]: unknown;
}

export interface InvoiceInstallment {
  [key: string]: unknown;
}

export interface InvoicePayment {
  [key: string]: unknown;
}

// ---- Invoice ----

export type InvoiceStatus =
  | "DRAFT"
  | "OPEN"
  | "PARTIAL"
  | "PAID"
  | "OVERDUE"
  | "VOID"
  | "UNCOLLECTIBLE";

// Shape returned by GET /invoices (list) — lean nested objects
export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  customerId: string;
  quoteId: string | null;
  paymentTermId: string | null;
  stripeCustomerId: string | null;
  stripeInvoiceId: string | null;
  hostedInvoiceUrl: string | null;
  invoicePdfUrl: string | null;
  subtotal: string;
  discount: string;
  taxRate: string;
  taxAmount: string;
  total: string;
  amountPaid: string;
  amountDue: string;
  status: InvoiceStatus;
  sentAt: string | null;
  paidAt: string | null;
  dueDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customer: InvoiceCustomerSummary;
  paymentTerm: InvoicePaymentTerm | null;
  quote: InvoiceQuoteSummary | null;
  installments: InvoiceInstallment[];
  payments: InvoicePayment[];
}

// Shape returned by GET /invoices/:id (single) — full nested objects + lineItems
export interface Invoice extends Omit<InvoiceListItem, "customer" | "quote"> {
  customer: InvoiceCustomerDetail;
  quote: InvoiceQuoteDetail | null;
  lineItems: InvoiceLineItem[];
}

// ---- Request payloads ----

export interface CreateInvoicePayload {
  customerId: string;
  quoteId?: string;
  paymentTermId?: string;
  taxRate: number;
  discount: number;
  dueDate?: string;
  notes?: string;
  lineItems: InvoiceLineItemPayload[];
}

export interface GetInvoicesParams {
  page?: number;
  limit?: number;
  customerId?: string;
  quoteId?: string;
  search?: string;
  status?: InvoiceStatus;
}

export interface SendInvoicePayload {
  sendEmail: boolean;
  sendWhatsApp: boolean;
}
export interface InvoiceSummary {
  outstanding: number;
  overdue: number;
  collected: number;
}
export interface PaymentSummary {
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
}

export interface PaymentHistoryItem {
  id: string;
  paymentId: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  date: string; // ISO 8601 date string
  method: string | null;
  status: "Completed" | "Pending" | "Failed" | string;
}

export interface InvoiceStatusCounts {
  DRAFT: number;
  OPEN: number;
  PARTIAL: number;
  PAID: number;
  OVERDUE: number;
  VOID: number;
  UNCOLLECTIBLE: number;
}
// ---- Response envelopes ----

export type PaymentHistoryResponse = PaginatedApiResponse<PaymentHistoryItem[]>;
export type GetPaymentSummaryResponse = ApiResponse<PaymentSummary>;
export type GetInvoicesSummaryResponse = ApiResponse<InvoiceSummary>;
export type GetInvoicesResponse = PaginatedApiResponse<InvoiceListItem[]> & {
  statusCounts: InvoiceStatusCounts;
};
export type GetInvoiceByIdResponse = ApiResponse<Invoice>;
export type CreateInvoiceResponse = ApiResponse<Invoice>;
export type UpdateInvoiceResponse = ApiResponse<Invoice>;
export type SendInvoiceResponse = ApiResponse<Invoice>;
export type SendInvoiceReminderResponse = ApiResponse<Invoice>;
