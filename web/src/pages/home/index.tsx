import React from "react";

import { useAuthToken } from "@/lib/hooks/auth";
import Dashboard from "./dashboard";
import Login from "./login";

export default function Home() {
  const { isAuthenticated } = useAuthToken();
  return isAuthenticated ? <Dashboard /> : <Login />;
}
