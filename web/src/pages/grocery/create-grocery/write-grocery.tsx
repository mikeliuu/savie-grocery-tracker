import React from "react";
import MenuLayout from "@/layouts/menu-layout";
import SplashScreen from "@/components/splash-screen";
import BackActionMenuLayout from "@/layouts/back-action-menu-layout";
import WriteGroceryForm from "@/components/write-grocery-form";
import { useNavigate } from "react-router-dom";
import AppRoutes from "@/lib/routes";

export default function WriteGrocery() {
  const navigate = useNavigate();

  const goToGroceryList = () => {
    navigate(AppRoutes.Groceries);
  };

  return (
    <BackActionMenuLayout heading="Create Grocery">
      <WriteGroceryForm onSubmit={goToGroceryList} />
    </BackActionMenuLayout>
  );
}
