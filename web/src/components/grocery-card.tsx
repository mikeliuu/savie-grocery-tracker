import React, { useEffect, useMemo, useState } from "react";
import { Card, CardProps } from "@/components/ui/card";
import { Grocery } from "@/lib/types/grocery";
import {
  classMerge,
  dateFromNow,
  getGroceryInfoMessage,
  hasExpiredGroceryItem,
} from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import _ from "lodash";

interface GroceryCardProps extends CardProps {
  loading?: boolean;
  data?: Grocery;
}

export default function GroceryCard({
  loading = false,
  data,
  ...props
}: GroceryCardProps) {
  const hasExpiredItem = useMemo(() => hasExpiredGroceryItem(data!), [data]);

  const infoMessage = useMemo(() => getGroceryInfoMessage(data!), [data]);

  return (
    <Card
      className={classMerge("p-4", { "pointer-events-none": loading })}
      {...props}
    >
      {loading ? (
        <>
          <Skeleton className="mb-2" />
          <Skeleton count={2} lineClass="w-80" />
        </>
      ) : (
        <>
          <div className="flex flex-nowrap items-baseline justify-between mb-2">
            <p className="font-normal text-gray-900 flex-auto">
              {_.truncate(data?.name)}
            </p>

            {hasExpiredItem && (
              <Badge
                variant="error"
                className=""
                spanClass="px-2 py-1 flex-none"
              >
                Expired
              </Badge>
            )}
          </div>

          <p className="text-gray-500 text-sm">{infoMessage}</p>
        </>
      )}
    </Card>
  );
}
