import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthToken } from "@/lib/hooks/auth";

interface PrivateRouteProps {
  redirect?: string;
}

export default function PrivateRoute({ redirect = "/" }: PrivateRouteProps) {
  const { isAuthenticated } = useAuthToken();

  return isAuthenticated ? <Outlet /> : <Navigate to={redirect} />;
}
