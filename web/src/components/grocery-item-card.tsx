import React, { useEffect, useMemo, useState } from "react";
import { Card, CardProps } from "@/components/ui/card";
import { Grocery, GroceryItem } from "@/lib/types/grocery";
import {
  classMerge,
  dateFromNow,
  getGroceryInfoMessage,
  getGroceryItemInfoMessage,
  hasExpiredGroceryItem,
  isDateExpired,
} from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import _ from "lodash";

interface GroceryItemCardProps extends CardProps {
  loading?: boolean;
  groupData?: Grocery;
  data?: GroceryItem;
}

export default function GroceryItemCard({
  loading = false,
  groupData,
  data,
  ...props
}: GroceryItemCardProps) {
  const isExpired = useMemo(() => isDateExpired(data?.expiryDate), [data]);

  const infoMessage = useMemo(() => getGroceryItemInfoMessage(data!), [data]);

  return (
    <Card
      className={classMerge("p-4", {
        "pointer-events-none": loading || !!groupData?.deletedAt,
      })}
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
              {_.truncate(groupData?.name)}
            </p>

            {isExpired && (
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
