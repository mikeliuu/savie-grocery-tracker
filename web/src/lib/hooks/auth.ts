import { useState } from "react";
import { STORAGE_TOKEN_KEY } from "../constants";
import AppRoutes from "../routes";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleAuthMutation } from "@/redux/services/authApi";
import { useNavigate } from "react-router-dom";

export function useAuthToken() {
  const [token] = useState(
    () => window.localStorage.getItem(STORAGE_TOKEN_KEY) || "",
  );

  const login = (token: string) => {
    window.localStorage.setItem(STORAGE_TOKEN_KEY, token);

    window.location.href = AppRoutes.Home;
  };

  const clearToken = () => {
    window.localStorage.removeItem(STORAGE_TOKEN_KEY);
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_TOKEN_KEY);

    window.location.href = AppRoutes.Home;
  };

  const isAuthenticated = !!token?.length;

  return {
    isAuthenticated,
    token,
    clearToken,
    login,
    logout,
  };
}

export const useGoogleAuth = () => {
  const navigate = useNavigate();

  const { login } = useAuthToken();

  const [googleLogin, { isLoading }] = useGoogleAuthMutation();

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (res) => {
      const result = await googleLogin({ code: res?.code }).unwrap();

      login(result?.accessToken);

      if (window.location.pathname !== AppRoutes.Home) navigate(AppRoutes.Home);
    },
  });

  return {
    isLoading,
    handleGoogleLogin,
  };
};
