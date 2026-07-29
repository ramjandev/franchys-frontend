import type { GarmentOption, MockupLayer } from "@/store/mockUp/designSlice";
import {
  GARMENT_OPTIONS,
  addLayer as addLayerAction,
  duplicateLayer as duplicateLayerAction,
  redo as redoAction,
  removeLayer as removeLayerAction,
  resetCanvas as resetCanvasAction,
  setActiveTool as setActiveToolAction,
  setActiveView as setActiveViewAction,
  setClothingCode as setClothingCodeAction,
  setHasGarment as setHasGarmentAction,
  setLayersByView as setLayersByViewAction,
  setProductColor as setProductColorAction,
  setSelectedGarment as setSelectedGarmentAction,
  setSelectedLayerId as setSelectedLayerIdAction,
  setZoom as setZoomAction,
  undo as undoAction,
  updateLayer as updateLayerAction,
} from "@/store/mockUp/designSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export type {
  GarmentColor,
  GarmentOption,
  MockupLayer,
} from "@/store/mockUp/designSlice";
export { GARMENT_OPTIONS };

export const useMockup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.design);

  const activeLayers = state.layersByView[state.activeView] || [];
  const selectedLayer = activeLayers.find(
    (l) => l.id === state.selectedLayerId,
  );

  const scale = selectedLayer ? Math.round(selectedLayer.scale * 100) : 100;
  const rotation = selectedLayer ? selectedLayer.rotation : 0;

  const setScale = (val: number) => {
    if (state.selectedLayerId) {
      dispatch(
        updateLayerAction({
          id: state.selectedLayerId,
          data: { scale: val / 100 },
        }),
      );
    }
  };

  const setRotation = (val: number) => {
    if (state.selectedLayerId) {
      dispatch(
        updateLayerAction({
          id: state.selectedLayerId,
          data: { rotation: val },
        }),
      );
    }
  };

  return {
    clothingCode: state.clothingCode,
    setClothingCode: (code: string) => dispatch(setClothingCodeAction(code)),
    hasGarment: state.hasGarment,
    setHasGarment: (val: boolean) => dispatch(setHasGarmentAction(val)),
    selectedGarment: state.selectedGarment,
    setSelectedGarment: (g: GarmentOption | null) =>
      dispatch(setSelectedGarmentAction(g)),
    productColor: state.productColor,
    setProductColor: (color: string) => dispatch(setProductColorAction(color)),
    activeView: state.activeView,
    setActiveView: (view: string) => dispatch(setActiveViewAction(view)),
    layersByView: state.layersByView,
    setLayersByView: (
      updater:
        | Record<string, MockupLayer[]>
        | ((
            prev: Record<string, MockupLayer[]>,
          ) => Record<string, MockupLayer[]>),
    ) => {
      const next =
        typeof updater === "function"
          ? (updater as any)(state.layersByView)
          : updater;
      dispatch(setLayersByViewAction(next));
    },
    selectedLayerId: state.selectedLayerId,
    setSelectedLayerId: (id: string | null) =>
      dispatch(setSelectedLayerIdAction(id)),
    activeTool: state.activeTool,
    setActiveTool: (tool: string) => dispatch(setActiveToolAction(tool)),
    scale,
    setScale,
    rotation,
    setRotation,
    zoom: state.zoom,
    setZoom: (val: number) => dispatch(setZoomAction(val)),
    addLayer: (type: MockupLayer["type"], extra?: Partial<MockupLayer>) =>
      dispatch(addLayerAction(type, extra)),
    updateLayer: (id: string, data: Partial<MockupLayer>) =>
      dispatch(updateLayerAction({ id, data })),
    removeLayer: (id: string) => dispatch(removeLayerAction(id)),
    duplicateLayer: (id: string) => dispatch(duplicateLayerAction(id)),
    resetCanvas: () => dispatch(resetCanvasAction()),
    undo: () => dispatch(undoAction()),
    redo: () => dispatch(redoAction()),
    hasUndo: state.history.length > 0,
    hasRedo: state.future.length > 0,
  };
};

export default useMockup;
