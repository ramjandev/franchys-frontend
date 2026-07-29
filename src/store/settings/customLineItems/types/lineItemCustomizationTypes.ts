import { ApiResponse } from "@/store/Auth/types/authTypes";

export interface LineItemColumns {
  quantity: boolean;
  itemNumber: boolean;
  category: boolean;
  description: boolean;
  color: boolean;
  markup: boolean;
  price: boolean;
}

export interface SizeOption {
  key: string;
  size: string;
  selected: boolean;
}

export interface SizingOptions {
  adultSizes: SizeOption[];
  youthSizes: SizeOption[];
  toddlerSizes: SizeOption[];
  babyInfantSizes: SizeOption[];
}

export interface LineItemCustomization {
  columns: LineItemColumns;
  sizingOptions: SizingOptions;
}

export type GetLineItemCustomizationResponse =
  ApiResponse<LineItemCustomization>;

export interface UpdateLineItemCustomizationPayload {
  showQuantity: boolean;
  showItemNumber: boolean;
  showCategory: boolean;
  showDescription: boolean;
  showColor: boolean;
  showMarkup: boolean;
  showPrice: boolean;

  sizeAdultXS: boolean;
  sizeAdultS: boolean;
  sizeAdultM: boolean;
  sizeAdultL: boolean;
  sizeAdultXL: boolean;
  sizeAdult2XL: boolean;
  sizeAdult3XL: boolean;
  sizeAdult4XL: boolean;

  sizeYouthXS: boolean;
  sizeYouthS: boolean;
  sizeYouthM: boolean;
  sizeYouthL: boolean;
  sizeYouthXL: boolean;

  sizeToddler2T: boolean;
  sizeToddler3T: boolean;
  sizeToddler4T: boolean;
  sizeToddler5T: boolean;
  sizeToddler6T: boolean;

  sizeBabyNewborn: boolean;
  sizeBaby3Months: boolean;
  sizeBaby6Months: boolean;
  sizeBaby9Months: boolean;
  sizeBaby12Months: boolean;
  sizeBaby18Months: boolean;
  sizeBaby24Months: boolean;
}

export type UpdateLineItemCustomizationResponse =
  ApiResponse<LineItemCustomization>;

export type GetSelectedSizesResponse = ApiResponse<string[]>;
