import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import authReducer from "./Auth/authSlice";
import { baseAPI } from "./BaseApi/baseAPI";
import imageReducer from "./imageSlice/imageSlice";
import designReducer from "./mockUp/designSlice";

import * as storageModule from "redux-persist/lib/storage";

const storage =
  (storageModule as any).default?.default ??
  (storageModule as any).default ??
  storageModule;
const persistConfig = {
  key: "auth",
  storage,
};

const imagePersistConfig = {
  key: "image",
  storage,
  whitelist: ["productType", "selectedProduct"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const persistedImageReducer = persistReducer(imagePersistConfig, imageReducer);

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    design: designReducer,
    auth: persistedReducer,
    image: persistedImageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
