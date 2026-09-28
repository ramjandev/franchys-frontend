import type { MockupLayer } from "@/store/mockUp/designSlice";
import {
  addLayer as addLayerAction,
  duplicateLayer as duplicateLayerAction,
  redo as redoAction,
  removeLayer as removeLayerAction,
  resetCanvas as resetCanvasAction,
  setActiveTool as setActiveToolAction,
  setActiveView as setActiveViewAction,
  setCanvasProductImage as setCanvasProductImageAction,
  setProductViews as setProductViewsAction,
  setLayersByView as setLayersByViewAction,
  setSelectedLayerId as setSelectedLayerIdAction,
  setZoom as setZoomAction,
  undo as undoAction,
  updateLayer as updateLayerAction,
} from "@/store/mockUp/designSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export type { MockupLayer } from "@/store/mockUp/designSlice";

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
    canvasProductImage: state.canvasProductImage,
    setCanvasProductImage: (image: string | null) =>
      dispatch(setCanvasProductImageAction(image)),
    productViews: state.productViews,
    setProductViews: (views: string[]) =>
      dispatch(setProductViewsAction(views)),
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
