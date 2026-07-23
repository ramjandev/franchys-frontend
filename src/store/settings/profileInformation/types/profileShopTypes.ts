import { ApiResponse } from "@/store/Auth/types/authTypes";

// ---- Profile Shop ----

export interface ProfileShop {
  id: string;
  companyName: string;
  companyEmail: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  website: string;
  facebook: string;
  whatsapp: string;
  tiktok: string;
  instagram: string;
  companyLogo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileShopPayload {
  companyName?: string;
  companyEmail?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  website?: string;
  facebook?: string;
  whatsapp?: string;
  tiktok?: string;
  instagram?: string;
  companyLogo?: File;
}

export type GetProfileShopResponse = ApiResponse<ProfileShop>;
export type UpdateProfileShopResponse = ApiResponse<ProfileShop>;

// ---- User Profile (auth/me + users/profile) ----

export type UserRole = "SUPER_ADMIN" | "ADMIN" | string;
export type UserStatus = "TRIAL" | "ACTIVE" | "SUSPENDED" | "BANNED" | string;

export interface UserPermission {
  [key: string]: unknown;
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  googleAuth: boolean;
  language: string | null;
  profileImage: string | null;
  avatar: string | null;
  operationsRole: string | null;
  isVerified: boolean;
  timezone: string | null;
  phone: string | null;
  address: string | null;
  country: string | null;
  tasksRemainderEmail: boolean;
  taskAssignEmail: boolean;
  createAt: string;
  updatedAt: string;
  userPermissions: UserPermission[];
}

export interface UpdateUserProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  country?: string;
  language?: string;
  timezone?: string;
  profileImage?: File;
}

export type GetMeResponse = ApiResponse<UserProfile>;
export type UpdateUserProfileResponse = ApiResponse<UserProfile>;
