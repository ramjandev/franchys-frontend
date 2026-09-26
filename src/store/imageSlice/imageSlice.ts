import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductAutocompleteItem } from "../Product/types/productTypes";
import { SanmarProductAutocompleteItem } from "../sanmar/types/sanmarTypes";

export type ProductType = "system" | "sanmar";
export type SelectProduct =
  | ProductAutocompleteItem
  | SanmarProductAutocompleteItem
  | null;

export interface ActiveLineItemTarget {
  groupIndex: number;
  lineItemIndex: number;
  itemNumber?: string;
  productId?: string;
}

interface ImageState {
  productType: ProductType;
  selectedProduct: SelectProduct;
  mockupUrls: string[];
  lineItemMockups: Record<string, string[]>;
  activeLineItemTarget: ActiveLineItemTarget | null;
}

const initialState: ImageState = {
  productType: "system",
  selectedProduct: null,
  mockupUrls: [],
  lineItemMockups: {},
  activeLineItemTarget: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setProductType(state, action: PayloadAction<ProductType>) {
      state.productType = action.payload;
    },
    setSelectedProduct(state, action: PayloadAction<SelectProduct>) {
      state.selectedProduct = action.payload;
    },
    setMockupUrls(state, action: PayloadAction<string[]>) {
      state.mockupUrls = action.payload;
    },
    addMockupUrls(state, action: PayloadAction<string[]>) {
      const incoming = action.payload || [];
      state.mockupUrls = Array.from(
        new Set([...state.mockupUrls, ...incoming]),
      );

      if (state.activeLineItemTarget) {
        const key = `${state.activeLineItemTarget.groupIndex}-${state.activeLineItemTarget.lineItemIndex}`;
        const existing = state.lineItemMockups[key] || [];
        state.lineItemMockups[key] = Array.from(
          new Set([...existing, ...incoming]),
        );
      }
    },
    setLineItemMockups(
      state,
      action: PayloadAction<{ key: string; urls: string[] }>,
    ) {
      state.lineItemMockups[action.payload.key] = action.payload.urls;
    },
    addLineItemMockups(
      state,
      action: PayloadAction<{ key: string; urls: string[] }>,
    ) {
      const { key, urls } = action.payload;
      const existing = state.lineItemMockups[key] || [];
      state.lineItemMockups[key] = Array.from(new Set([...existing, ...urls]));
      state.mockupUrls = Array.from(new Set([...state.mockupUrls, ...urls]));
    },
    removeLineItemMockup(
      state,
      action: PayloadAction<{ key: string; url: string }>,
    ) {
      const { key, url } = action.payload;
      if (state.lineItemMockups[key]) {
        state.lineItemMockups[key] = state.lineItemMockups[key].filter(
          (u) => u !== url,
        );
      }
    },
    setActiveLineItemTarget(
      state,
      action: PayloadAction<ActiveLineItemTarget | null>,
    ) {
      state.activeLineItemTarget = action.payload;
    },
    clearMockups(state) {
      state.mockupUrls = [];
      state.lineItemMockups = {};
      state.activeLineItemTarget = null;
    },
  },
});

export const {
  setProductType,
  setSelectedProduct,
  setMockupUrls,
  addMockupUrls,
  setLineItemMockups,
  addLineItemMockups,
  removeLineItemMockup,
  setActiveLineItemTarget,
  clearMockups,
} = imageSlice.actions;

export default imageSlice.reducer;
