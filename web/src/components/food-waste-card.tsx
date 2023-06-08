import React, { useMemo, useState } from "react";
import CountUp from "react-countup";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { GroceryWasteSummary } from "@/lib/types/grocery";
import { BarChart, BarChartProps } from "@tremor/react";
import { classMerge } from "@/lib/utils";

interface FoodWasteCardProps
  extends Omit<BarChartProps, "data" | "categories" | "index"> {
  className?: string;
  label?: string;
  loading?: boolean;
  data?: GroceryWasteSummary;
}

export default function FoodWasteCard({
  className,
  label = "Weekly food waste cost",
  loading = false,
  data,
  ...props
}: FoodWasteCardProps) {
  const yourTotalCost = "Your total cost";
  const averageAccountCost = "Average Account Cost";

  const chartdata = useMemo(
    () => [
      {
        name: "This Week",
        [yourTotalCost]: data?.totalCostOfThisWeek,
        [averageAccountCost]: data?.averageAccountCostOfThisWeek,
      },
      {
        name: "Last Week",
        [yourTotalCost]: data?.totalCostOfLastWeek,
        [averageAccountCost]: data?.averageAccountCostOfLastWeek,
      },
    ],
    [data],
  );

  const dataFormatter = (number: number) => {
    return "£" + Intl.NumberFormat("uk").format(number).toString();
  };

  return (
    <Card variant="static" className={classMerge(className)}>
      {loading ? (
        <>
          <Skeleton lineClass="w-80 mb-6" />

          <Skeleton lineClass="w-full h-80 rounded-lg" />

          <Skeleton lineClass="w-80 mt-6 mb-4" />

          <Skeleton lineClass="w-60 rounded-lg" />
        </>
      ) : (
        <>
          <p className="text-xl font-semibold text-gray-900 mb-6">{label}</p>

          {data && !!chartdata?.length ? (
            <BarChart
              {...props}
              data={chartdata}
              index="name"
              categories={[yourTotalCost, averageAccountCost]}
              colors={["emerald", "gray"]}
              valueFormatter={dataFormatter}
              yAxisWidth={40}
            />
          ) : (
            <div className="w-full h-80 rounded-lg flex items-center justify-center text-center text-gray-500 text-sm border-gray-200">
              Your summary is on the way. <br />
              Make sure to track your food waste. But most inportantly save your
              food.
            </div>
          )}

          <p className="text-xl font-semibold text-gray-900 smt-6 mb-4">
            Number of food waste
          </p>

          {data ? (
            <div className="flex items-baseline justify-start flex-row">
              <p className="text-5xl font-semibold text-gray-900 mr-3">
                <CountUp
                  duration={2}
                  start={0}
                  end={data?.totalItemsOfThisWeek ?? 0}
                />
              </p>

              <p className="text-gray-500 text-sm font-normal">
                from {data?.totalItemsOfLastWeek} items last week
              </p>
            </div>
          ) : (
            <div className="w-full flex items-center justify-start text-gray-500 text-sm border-gray-200">
              No items wasted
            </div>
          )}
        </>
      )}
    </Card>
  );
}
