import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { accountApi } from "./services/accountApi";
import { groceryApi } from "./services/groceryApi";
import { locationApi } from "./services/locationApi";
import { categoryApi } from "./services/categoryApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { rtkQueryErrorMiddleware } from "./rtk-query-error-middleware";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [groceryApi.reducerPath]: groceryApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      rtkQueryErrorMiddleware,
      authApi.middleware,
      userApi.middleware,
      accountApi.middleware,
      groceryApi.middleware,
      locationApi.middleware,
      categoryApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
