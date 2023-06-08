import React, { useState } from "react";

import MenuLayout from "@/layouts/menu-layout";
import { Card } from "@/components/ui/card";
import {
  useGetRecentGroceriesQuery,
  useGetWasteCostQuery,
} from "@/redux/services/groceryApi";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart } from "@tremor/react";
import { Datepicker } from "@/components/ui/datepicker";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import AppRoutes from "@/lib/routes";
import RecentGroceryCard from "@/components/recent-grocery-card";
import FoodWasteCard from "@/components/food-waste-card";

export default function Dashboard() {
  const { data: wasteCostData, isLoading: isWastCostLoading } =
    useGetWasteCostQuery({ since: "weekly" });

  const { data: recentGroceries, isLoading: isRecentGroceriesLoading } =
    useGetRecentGroceriesQuery({ since: "weekly" });

  return (
    <MenuLayout>
      <div className="grid grid-cols-1 gap-4">
        <RecentGroceryCard
          loading={isRecentGroceriesLoading}
          data={recentGroceries}
        />

        <FoodWasteCard data={wasteCostData} loading={isWastCostLoading} />
      </div>
    </MenuLayout>
  );
}
