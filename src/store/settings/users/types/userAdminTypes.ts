// ---- Permissions ----

import {
  ApiResponse,
  PaginatedApiResponse,
} from "@/store/Auth/types/authTypes";

export interface AdminPermissions {
  canCreateCustomers: boolean;
  canUpdateCustomers: boolean;
  canDeleteCustomers: boolean;
  canCreateQuotes: boolean;
  canUpdateQuotes: boolean;
  canDeleteQuotes: boolean;
  canApproveQuotes: boolean;
  canCreateJobs: boolean;
  canUpdateJobs: boolean;
  canDeleteJobs: boolean;
  canCreateProducts: boolean;
  canUpdateProducts: boolean;
  canDeleteProducts: boolean;
  canCreateUsers: boolean;
  canUpdateUsers: boolean;
  canDeleteUsers: boolean;
  canCreateInvoices: boolean;
  canUpdateInvoices: boolean;
  canDeleteInvoices: boolean;
  canApproveInvoices: boolean;
  canTakePayment: boolean;
  canCreateInvoiceFees: boolean;
  canUpdateInvoiceFees: boolean;
  canDeleteInvoiceFees: boolean;
  canChangeInvoiceInformation: boolean;
  canChangeShopInformation: boolean;
  canCreateVendor: boolean;
  canUpdateVendor: boolean;
  canDeleteVendor: boolean;
}

export interface AdminPermissionsWithMeta extends AdminPermissions {
  userPermissionId: string;
  userId: string;
}

// ---- Core entity ----

export type AdminRole = "ADMIN" | "SUPER_ADMIN" | string;
export type AdminStatus = "TRIAL" | "ACTIVE" | "SUSPEND" | "BANNED" | string;

export interface AdminUser {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  status: AdminStatus;
  updatedAt: string;
  createAt: string;
  googleAuth: boolean;
  language: string | null;
  profileImage: string | null;
  operationsRole: string | null;
  otp: string | null;
  isVerified: boolean;
  refreshToken: string | null;
  resetToken: string | null;
  resetTokenExpires: string | null;
  avatar: string | null;
  timezone: string | null;
  tasksRemainderEmail: boolean;
  taskAssignEmail: boolean;
  isDeleted: boolean;
  phone: string | null;
  address: string | null;
  country: string | null;
  userPermissions: AdminPermissionsWithMeta[];
}

// ---- Request payloads ----

export interface CreateAdmin {
  name: string;
  email: string;
  password: string;
  permissions: AdminPermissions;
}

export type UpdateAdmin = Partial<Omit<CreateAdmin, "password">> & {
  password?: string;
};

export interface GetAdminParams {
  search?: string;
  page?: number;
  limit?: number;
}

export type CreateAdminResponse = ApiResponse<AdminUser>;
export type UpdateAdminResponse = ApiResponse<AdminUser>;
export type GetAdminResponse = PaginatedApiResponse<AdminUser[]>;
export type GetAdminByIdResponse = ApiResponse<AdminUser>;
