import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MockupLayer {
  id: string;
  type: "image" | "text" | "shape" | "path";
  src?: string;
  text?: string;
  shapeType?: "rect" | "circle" | "triangle" | "star";
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  scale: number;
  color?: string;
  fontSize?: number;
  visible: boolean;
  curved?: boolean;
  points?: { x: number; y: number }[];
  strokeWidth?: number;
}

export interface GarmentColor {
  name: string;
  hex: string;
}

export interface GarmentOption {
  code: string;
  name: string;
  colors: GarmentColor[];
  views: Record<string, string>;
}

export const GARMENT_OPTIONS: GarmentOption[] = [
  {
    code: "3001",
    name: "Bella+Canvas CVC Unisex T-Shirt",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1B2A4A" },
      { name: "Red", hex: "#C8102E" },
      { name: "Athletic Heather", hex: "#B2B4B2" },
    ],
    views: {
      Front: "front",
      Back: "back",
      "Left Sleeve": "left",
      "Right Sleeve": "right",
    },
  },
  {
    code: "5000",
    name: "Gildan Heavy Cotton T-Shirt",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Royal Blue", hex: "#004B87" },
      { name: "Red", hex: "#DA291C" },
    ],
    views: {
      Front: "front",
      Back: "back",
      "Left Sleeve": "left",
      "Right Sleeve": "right",
    },
  },
  {
    code: "8000",
    name: "Gildan DryBlend 50/50 T-Shirt",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Sport Grey", hex: "#9E9E9E" },
      { name: "Forest Green", hex: "#1E3F20" },
    ],
    views: {
      Front: "front",
      Back: "back",
      "Left Sleeve": "left",
      "Right Sleeve": "right",
    },
  },
  {
    code: "18500",
    name: "Gildan Heavy Blend Hoodie",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1B2A4A" },
      { name: "Grey", hex: "#9E9E9E" },
    ],
    views: {
      Front: "front",
      Back: "back",
      "Left Sleeve": "left",
      "Right Sleeve": "right",
    },
  },
];

interface DesignState {
  clothingCode: string;
  hasGarment: boolean;
  selectedGarment: GarmentOption | null;
  productColor: string;
  activeView: string;
  layersByView: Record<string, MockupLayer[]>;
  selectedLayerId: string | null;
  activeTool: string;
  zoom: number;
  history: string[];
  future: string[];
  privacy?: boolean;
}

const initialState: DesignState = {
  clothingCode: "",
  hasGarment: false,
  selectedGarment: null,
  productColor: "#FFFFFF",
  activeView: "Front",
  layersByView: {
    Front: [],
    Back: [],
    "Left Sleeve": [],
    "Right Sleeve": [],
  },
  selectedLayerId: null,
  activeTool: "erase",
  zoom: 100,
  history: [],
  future: [],
  privacy: false,
};

const makeId = (type: string) =>
  `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function buildLayer(
  type: MockupLayer["type"],
  extra?: Partial<MockupLayer>,
): MockupLayer {
  return {
    id: makeId(type),
    type,
    x: type === "path" ? 0 : 80,
    y: type === "path" ? 0 : 100,
    w: type === "text" ? 120 : type === "path" ? 112 : 100,
    h: type === "text" ? 40 : type === "path" ? 140 : 100,
    rotation: 0,
    scale: 1,
    visible: true,
    color:
      type === "text" ? "#000000" : type === "shape" ? "#4A90E2" : "#E11D48",
    fontSize: type === "text" ? 18 : undefined,
    ...extra,
  };
}

const designSlice = createSlice({
  name: "design",
  initialState,
  reducers: {
    setClothingCode(state, action: PayloadAction<string>) {
      state.clothingCode = action.payload;
    },
    setHasGarment(state, action: PayloadAction<boolean>) {
      state.hasGarment = action.payload;
    },
    setSelectedGarment(state, action: PayloadAction<GarmentOption | null>) {
      state.selectedGarment = action.payload;
    },
    setProductColor(state, action: PayloadAction<string>) {
      state.productColor = action.payload;
    },
    setActiveView(state, action: PayloadAction<string>) {
      state.activeView = action.payload;
    },
    setLayersByView(
      state,
      action: PayloadAction<Record<string, MockupLayer[]>>,
    ) {
      state.layersByView = action.payload;
    },
    setSelectedLayerId(state, action: PayloadAction<string | null>) {
      state.selectedLayerId = action.payload;
    },
    setActiveTool(state, action: PayloadAction<string>) {
      state.activeTool = action.payload;
    },
    setZoom(state, action: PayloadAction<number>) {
      state.zoom = action.payload;
    },
    addLayer: {
      reducer(state, action: PayloadAction<MockupLayer>) {
        state.history.push(JSON.stringify(state.layersByView));
        state.future = [];
        const view = state.activeView;
        const current = state.layersByView[view] || [];
        state.layersByView[view] = [...current, action.payload];
        state.selectedLayerId = action.payload.id;
      },
      prepare(type: MockupLayer["type"], extra?: Partial<MockupLayer>) {
        return { payload: buildLayer(type, extra) };
      },
    },
    updateLayer(
      state,
      action: PayloadAction<{ id: string; data: Partial<MockupLayer> }>,
    ) {
      const { id, data } = action.payload;
      const view = state.activeView;
      const current = state.layersByView[view] || [];
      state.layersByView[view] = current.map((l) =>
        l.id === id ? { ...l, ...data } : l,
      );
    },
    removeLayer(state, action: PayloadAction<string>) {
      state.history.push(JSON.stringify(state.layersByView));
      state.future = [];
      const view = state.activeView;
      const current = state.layersByView[view] || [];
      state.layersByView[view] = current.filter((l) => l.id !== action.payload);
      if (state.selectedLayerId === action.payload) {
        state.selectedLayerId = null;
      }
    },
    duplicateLayer(state, action: PayloadAction<string>) {
      const view = state.activeView;
      const current = state.layersByView[view] || [];
      const layerToCopy = current.find((l) => l.id === action.payload);
      if (!layerToCopy) return;
      state.history.push(JSON.stringify(state.layersByView));
      state.future = [];
      const newId = makeId(layerToCopy.type);
      const duplicated: MockupLayer = {
        ...layerToCopy,
        id: newId,
        x: layerToCopy.x + 15,
        y: layerToCopy.y + 15,
      };
      state.layersByView[view] = [...current, duplicated];
      state.selectedLayerId = newId;
    },
    resetCanvas(state) {
      state.history.push(JSON.stringify(state.layersByView));
      state.future = [];
      state.layersByView[state.activeView] = [];
      state.selectedLayerId = null;
    },
    undo(state) {
      if (state.history.length === 0) return;
      const prev = state.history[state.history.length - 1];
      state.history = state.history.slice(0, -1);
      state.future = [...state.future, JSON.stringify(state.layersByView)];
      state.layersByView = JSON.parse(prev);
      state.selectedLayerId = null;
    },
    redo(state) {
      if (state.future.length === 0) return;
      const next = state.future[state.future.length - 1];
      state.future = state.future.slice(0, -1);
      state.history = [...state.history, JSON.stringify(state.layersByView)];
      state.layersByView = JSON.parse(next);
      state.selectedLayerId = null;
    },

    //dashboard privacy
    togglePrivacy: (state) => {
      state.privacy = !state.privacy;
    },
  },
});

export const {
  setClothingCode,
  setHasGarment,
  setSelectedGarment,
  setProductColor,
  setActiveView,
  setLayersByView,
  setSelectedLayerId,
  setActiveTool,
  setZoom,
  addLayer,
  updateLayer,
  removeLayer,
  duplicateLayer,
  resetCanvas,
  undo,
  redo,
  //dashboard privacy
  togglePrivacy,
} = designSlice.actions;

export default designSlice.reducer;
