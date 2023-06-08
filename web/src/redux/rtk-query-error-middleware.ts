import { STORAGE_TOKEN_KEY } from "@/lib/constants";
import AppRoutes from "@/lib/routes";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const errorMessage = "Oops! Something went wrong.\nPlease try again later.";

export const rtkQueryErrorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      // redirect to login page if not auth & remove token
      if (action?.payload?.status === 401) {
        window.localStorage.removeItem(STORAGE_TOKEN_KEY);

        window.location.pathname = AppRoutes.Home;
      }

      // redirect to previous page if no permission
      if (action?.payload?.status === 403) {
        window.history.back();
      }

      toast.error(
        action?.payload?.data?.message ||
          action?.payload?.message ||
          errorMessage,
      );
    }

    return next(action);
  };
