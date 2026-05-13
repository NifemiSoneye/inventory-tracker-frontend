import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { inventoryApiSlice } from "../api/inventoryApi";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    [inventoryApiSlice.reducerPath]: inventoryApiSlice.reducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(inventoryApiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
