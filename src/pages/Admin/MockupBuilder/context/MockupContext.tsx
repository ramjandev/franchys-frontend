import React, { createContext, useContext, useState } from "react";

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
      { name: "Athletic Heather", hex: "#B2B4B2" }
    ],
    views: {
      Front: "front",
      Back: "back",
      "Left Sleeve": "left",
      "Right Sleeve": "right"
    }
  },
  {
    code: "5000",
    name: "Gildan Heavy Cotton T-Shirt",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Royal Blue", hex: "#004B87" },
      { name: "Red", hex: "#DA291C" }
    ],
    views: {
      Front: "front",
      Back: "back",
      "Left Sleeve": "left",
      "Right Sleeve": "right"
    }
  },
  {
    code: "8000",
    name: "Gildan DryBlend 50/50 T-Shirt",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Sport Grey", hex: "#9E9E9E" },
      { name: "Forest Green", hex: "#1E3F20" }
    ],
    views: {
      Front: "front",
      Back: "back",
      "Left Sleeve": "left",
      "Right Sleeve": "right"
    }
  },
  {
    code: "18500",
    name: "Gildan Heavy Blend Hoodie",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1B2A4A" },
      { name: "Grey", hex: "#9E9E9E" }
    ],
    views: {
      Front: "front",
      Back: "back",
      "Left Sleeve": "left",
      "Right Sleeve": "right"
    }
  }
];

interface MockupContextProps {
  clothingCode: string;
  setClothingCode: (code: string) => void;
  hasGarment: boolean;
  setHasGarment: (val: boolean) => void;
  selectedGarment: GarmentOption | null;
  setSelectedGarment: (garment: GarmentOption | null) => void;
  productColor: string;
  setProductColor: (color: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  layersByView: Record<string, MockupLayer[]>;
  setLayersByView: React.Dispatch<React.SetStateAction<Record<string, MockupLayer[]>>>;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  scale: number;
  setScale: (val: number) => void;
  rotation: number;
  setRotation: (val: number) => void;
  zoom: number;
  setZoom: (val: number) => void;
  addLayer: (type: "image" | "text" | "shape" | "path", extra?: Partial<MockupLayer>) => void;
  updateLayer: (id: string, data: Partial<MockupLayer>) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  resetCanvas: () => void;
  undo: () => void;
  redo: () => void;
  hasUndo: boolean;
  hasRedo: boolean;
}

const MockupContext = createContext<MockupContextProps | undefined>(undefined);

export const MockupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clothingCode, setClothingCodeState] = useState("");
  const [hasGarment, setHasGarment] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState<GarmentOption | null>(null);
  const [productColor, setProductColor] = useState("#FFFFFF");
  const [activeView, setActiveView] = useState("Front");
  const [layersByView, setLayersByView] = useState<Record<string, MockupLayer[]>>({
    Front: [],
    Back: [],
    "Left Sleeve": [],
    "Right Sleeve": []
  });
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState("erase");
  const [zoom, setZoom] = useState(100);

  // Sliders scale & rotation (for the selected layer)
  const [scale, setScaleState] = useState(100);
  const [rotation, setRotationState] = useState(0);

  // Simple Undo/Redo history
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);

  const setClothingCode = (code: string) => {
    setClothingCodeState(code);
  };

  const saveToHistory = (newLayers: Record<string, MockupLayer[]>) => {
    setHistory((prev) => [...prev, JSON.stringify(layersByView)]);
    setFuture([]);
    setLayersByView(newLayers);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [...f, JSON.stringify(layersByView)]);
    setLayersByView(JSON.parse(prev));
    setSelectedLayerId(null);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[future.length - 1];
    setFuture((f) => f.slice(0, -1));
    setHistory((h) => [...h, JSON.stringify(layersByView)]);
    setLayersByView(JSON.parse(next));
    setSelectedLayerId(null);
  };

  const addLayer = (type: "image" | "text" | "shape" | "path", extra?: Partial<MockupLayer>) => {
    const id = `${type}_${Date.now()}`;
    const newLayer: MockupLayer = {
      id,
      type,
      x: type === "path" ? 0 : 80,
      y: type === "path" ? 0 : 100,
      w: type === "text" ? 120 : type === "path" ? 112 : 100,
      h: type === "text" ? 40 : type === "path" ? 140 : 100,
      rotation: 0,
      scale: 1,
      visible: true,
      color: type === "text" ? "#000000" : type === "shape" ? "#4A90E2" : "#E11D48",
      fontSize: type === "text" ? 18 : undefined,
      ...extra
    };

    const currentLayers = layersByView[activeView] || [];
    const newLayers = {
      ...layersByView,
      [activeView]: [...currentLayers, newLayer]
    };
    saveToHistory(newLayers);
    setSelectedLayerId(id);
    setScaleState(100);
    setRotationState(0);
  };

  const updateLayer = (id: string, data: Partial<MockupLayer>) => {
    const currentLayers = layersByView[activeView] || [];
    const newLayers = {
      ...layersByView,
      [activeView]: currentLayers.map((l) => (l.id === id ? { ...l, ...data } : l))
    };

    setLayersByView(newLayers);
  };

  const removeLayer = (id: string) => {
    const currentLayers = layersByView[activeView] || [];
    const newLayers = {
      ...layersByView,
      [activeView]: currentLayers.filter((l) => l.id !== id)
    };
    saveToHistory(newLayers);
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const duplicateLayer = (id: string) => {
    const currentLayers = layersByView[activeView] || [];
    const layerToCopy = currentLayers.find((l) => l.id === id);
    if (!layerToCopy) return;

    const newId = `${layerToCopy.type}_${Date.now()}`;
    const duplicated: MockupLayer = {
      ...layerToCopy,
      id: newId,
      x: layerToCopy.x + 15,
      y: layerToCopy.y + 15
    };

    const newLayers = {
      ...layersByView,
      [activeView]: [...currentLayers, duplicated]
    };
    saveToHistory(newLayers);
    setSelectedLayerId(newId);
  };

  const resetCanvas = () => {
    const newLayers = {
      ...layersByView,
      [activeView]: []
    };
    saveToHistory(newLayers);
    setSelectedLayerId(null);
  };

  const setScale = (val: number) => {
    setScaleState(val);
    if (selectedLayerId) {
      updateLayer(selectedLayerId, { scale: val / 100 });
    }
  };

  const setRotation = (val: number) => {
    setRotationState(val);
    if (selectedLayerId) {
      updateLayer(selectedLayerId, { rotation: val });
    }
  };

  // Sync scale/rotation when selecting a layer
  const currentLayers = layersByView[activeView] || [];
  const selectedLayer = currentLayers.find((l) => l.id === selectedLayerId);
  React.useEffect(() => {
    if (selectedLayer) {
      setScaleState(Math.round(selectedLayer.scale * 100));
      setRotationState(selectedLayer.rotation);
    }
  }, [selectedLayerId, activeView]);

  return (
    <MockupContext.Provider
      value={{
        clothingCode,
        setClothingCode,
        hasGarment,
        setHasGarment,
        selectedGarment,
        setSelectedGarment,
        productColor,
        setProductColor,
        activeView,
        setActiveView,
        layersByView,
        setLayersByView,
        selectedLayerId,
        setSelectedLayerId,
        activeTool,
        setActiveTool,
        scale,
        setScale,
        rotation,
        setRotation,
        zoom,
        setZoom,
        addLayer,
        updateLayer,
        removeLayer,
        duplicateLayer,
        resetCanvas,
        undo,
        redo,
        hasUndo: history.length > 0,
        hasRedo: future.length > 0
      }}
    >
      {children}
    </MockupContext.Provider>
  );
};

export const useMockup = () => {
  const context = useContext(MockupContext);
  if (!context) {
    throw new Error("useMockup must be used within a MockupProvider");
  }
  return context;
};
