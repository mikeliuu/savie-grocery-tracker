import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import AppRoutes from "@/lib/routes";
import { Grocery } from "@/lib/types/grocery";
import { Badge } from "./ui/badge";

interface RecentGroceryCardProps {
  className?: string;
  label?: string;
  loading?: boolean;
  limit?: number;
  data?: Grocery[];
}

export default function RecentGroceryCard({
  className,
  label = "Items added this week",
  loading = false,
  limit = 5,
  data = [],
}: RecentGroceryCardProps) {
  const isOverLimit = data?.length > limit;

  const remainingCount = `+ ${data?.length - limit}`;

  return (
    <Card variant="static">
      {loading ? (
        <>
          <Skeleton lineClass="w-80 mb-6" />

          <Skeleton count={2} className="" />
        </>
      ) : (
        <>
          <p className="text-xl font-semibold text-gray-900 mb-4">{label}</p>

          <div className="flex grid-flow-col gap-3.5 whitespace-nowrap flex-wrap flex-row items-baseline">
            {data?.length > 0 ? (
              <React.Fragment>
                {data?.map((item, index) => {
                  const isLastLimit = index + 1 > limit;

                  return (
                    !isLastLimit && (
                      <Link
                        className=""
                        to={`${AppRoutes.Groceries}/${item?.id}`}
                        key={item?.id}
                      >
                        <Badge>{item?.name}</Badge>
                      </Link>
                    )
                  );
                })}

                {isOverLimit && (
                  <p className="text-sm font-medium">{remainingCount}</p>
                )}
              </React.Fragment>
            ) : (
              <div className="text-gray-500 text-sm border-gray-200">
                No data found
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
