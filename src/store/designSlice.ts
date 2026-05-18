import { createSlice } from "@reduxjs/toolkit";

export interface Layer {
  id: number;
  type: "image" | "text" | "shape";
  src?: string;
  text?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  fontSize?: number;
}

interface DesignState {
  template: string;
  layers: Layer[];
  history: string[];
  future: string[];
  productColor: string;
  designWidth: number;
  designHeight: number;
  position: string;
  printMethod: string;
  selectedLayerId: number | null;
  privacy?: boolean;
}

const designSlice = createSlice({
  name: "design",
  initialState: {
    template: "front",
    layers: [] as Layer[],
    history: [] as string[],
    future: [] as string[],
    productColor: "#000000",
    designWidth: 8,
    designHeight: 10,
    position: "center",
    printMethod: "",
    selectedLayerId: null,
    privacy: false,
  } as DesignState,
  reducers: {
    addLayer: (state, action) => {
      state.history.push(JSON.stringify(state.layers));
      state.layers.push(action.payload);
      state.future = [];
    },

    updateLayer: (state, action) => {
      const { id, data } = action.payload;
      state.history.push(JSON.stringify(state.layers));
      state.layers = state.layers.map((l) =>
        l.id === id ? { ...l, ...data } : l,
      );
      state.future = [];
    },

    removeLayer: (state, action) => {
      state.history.push(JSON.stringify(state.layers));
      state.layers = state.layers.filter((l) => l.id !== action.payload);
      state.future = [];
      if (state.selectedLayerId === action.payload) {
        state.selectedLayerId = null;
      }
    },

    resetCanvas: (state) => {
      state.history.push(JSON.stringify(state.layers));
      state.layers = [];
      state.future = [];
      state.selectedLayerId = null;
    },

    undo: (state) => {
      if (!state.history.length) return;
      state.future.push(JSON.stringify(state.layers));
      state.layers = JSON.parse(state.history.pop()!);
    },

    redo: (state) => {
      if (!state.future.length) return;
      state.history.push(JSON.stringify(state.layers));
      state.layers = JSON.parse(state.future.pop()!);
    },

    setTemplate: (state, action) => {
      state.template = action.payload;
    },

    setProductColor: (state, action) => {
      state.productColor = action.payload;
    },

    setDesignSize: (state, action) => {
      const { width, height } = action.payload;
      if (width !== undefined) state.designWidth = width;
      if (height !== undefined) state.designHeight = height;
    },

    setPosition: (state, action) => {
      state.position = action.payload;
    },

    setPrintMethod: (state, action) => {
      state.printMethod = action.payload;
    },

    setSelectedLayer: (state, action) => {
      state.selectedLayerId = action.payload;
    },

    togglePrivacy: (state) => {
      state.privacy = !state.privacy;
    },
  },
});

export const {
  addLayer,
  updateLayer,
  removeLayer,
  resetCanvas,
  undo,
  redo,
  setTemplate,
  setProductColor,
  setDesignSize,
  setPosition,
  setPrintMethod,
  setSelectedLayer,
  togglePrivacy,
} = designSlice.actions;

export default designSlice.reducer;
