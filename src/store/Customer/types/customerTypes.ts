export type CustomerType = "PERSONAL" | "BUSINESS";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  website?: string;
  companyName?: string;
  taxId?: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  tags?: string[];
  notes?: string;
  customerType: CustomerType;
  orderPurpose?: string;
  eventType?: string;
  eventDate?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  language: string;
  website?: string;
  companyName?: string;
  taxId?: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  tags?: string[];
  notes?: string;
  orderPurpose?: string;
  eventType?: string;
  eventDate?: string;
  profileImage?: string;
}

export type UpdateCustomerRequest = Partial<CreateCustomerRequest> & {
  id: string;
};

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export type GetAllCustomersResponse = ApiResponse<Customer[]>;
export type GetCustomerResponse = ApiResponse<Customer>;
export type CreateCustomerResponse = ApiResponse<Customer>;
export type UpdateCustomerResponse = ApiResponse<Customer>;
