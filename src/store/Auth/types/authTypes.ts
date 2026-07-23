export type RegisterUserRequest = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface VerifyOtpResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: VerifyOtpData;
}

export interface VerifyOtpData {
  message: string;
  resetToken: string;
}
// types/api.ts
export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
