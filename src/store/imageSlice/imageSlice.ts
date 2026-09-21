import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductAutocompleteItem } from "../Product/types/productTypes";
import { SanmarProductAutocompleteItem } from "../sanmar/types/sanmarTypes";
export type ProductType = "system" | "sanmar";
export type SelectProduct =
  | ProductAutocompleteItem
  | SanmarProductAutocompleteItem
  | null;

interface ImageState {
  productType: ProductType;
  selectedProduct: SelectProduct;
}

const initialState: ImageState = {
  productType: "system",
  selectedProduct: null,
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
  },
});

export const { setProductType, setSelectedProduct } = imageSlice.actions;

export default imageSlice.reducer;
