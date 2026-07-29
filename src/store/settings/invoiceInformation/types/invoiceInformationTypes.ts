import { ApiResponse } from "@/store/Auth/types/authTypes";

export type PrintingLayout = "PORTRAIT" | "LANDSCAPE";
export type InvoicePrivacy = "ANYONE_WITH_LINK" | "ONLY_INVITED" | string;

export interface InvoiceInformation {
  iniId: string;
  currency: string;
  language: string;
  invoiceTaxRate: string;
  invoiceSeed: number;
  invoiceCommentary: string | null;
  termsAndCondition: string | null;
  refundPolicy: string | null;
  deliveryPolicy: string | null;
  paymentTramsAndCondition: string | null;
  showTotalQuantity: boolean;
  makeImprintsVisible: boolean;
  showPoNumber: boolean;
  printingLayout: PrintingLayout;
  invoicePrivacy: InvoicePrivacy;
  updatedAt: string;
  createAt: string;
}

export interface UpdateInvoiceInformationPayload {
  currency?: string;
  language?: string;
  invoiceTaxRate?: number;
  invoiceSeed?: number;
  invoiceCommentary?: string;
  termsAndCondition?: string;
  refundPolicy?: string;
  deliveryPolicy?: string;
  paymentTramsAndCondition?: string;
  showTotalQuantity?: boolean;
  makeImprintsVisible?: boolean;
  showPoNumber?: boolean;
  printingLayout?: PrintingLayout;
  invoicePrivacy?: InvoicePrivacy;
}

export type GetInvoiceInformationResponse = ApiResponse<InvoiceInformation>;
export type UpdateInvoiceInformationResponse = ApiResponse<InvoiceInformation>;
