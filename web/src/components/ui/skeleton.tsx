import * as React from "react";

import { classMerge } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  lineClass?: string;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, lineClass, count = 1, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        role="status"
        className={classMerge("w-full max-w-lg animate-pulse", className)}
      >
        {new Array(count).fill(null)?.map((item, index) => {
          return (
            <div
              key={index}
              className={classMerge(
                "bg-gray-200 rounded-full  h-4 w-48 max-w-full mb-1",
                lineClass,
              )}
            ></div>
          );
        })}
        <span className="sr-only">Loading...</span>
      </div>
    );
  },
);
