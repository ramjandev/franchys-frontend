export interface Fee {
  infId: string;
  feeName: string;
  amount: number;
  isTax: boolean;
  isDefaultAutoAdd: boolean;
  createAt: string;
  updatedAt: string;
}

export interface CreateFeeRequest {
  feeName: string;
  amount: number;
  isTax: boolean;
  isDefaultAutoAdd: boolean;
}

export type UpdateFeeRequest = Partial<CreateFeeRequest> & {
  infId: string;
};

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export type GetAllFeesResponse = ApiResponse<Fee[]>;
export type GetFeeResponse = ApiResponse<Fee>;
export type CreateFeeResponse = ApiResponse<Fee>;
export type UpdateFeeResponse = ApiResponse<Fee>;
