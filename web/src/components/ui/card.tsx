import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { classMerge } from "@/lib/utils";

export const cardVariants = cva("", {
  variants: {
    variant: {
      default:
        "block bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100   ",
      static:
        "block bg-white border border-gray-200 rounded-lg shadow  ",
    },
    size: {
      initial: "",
      default: "p-6",
      // sm: "h-9 px-3 rounded-md",
      // lg: "h-11 px-8 rounded-md",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={classMerge(cardVariants({ variant, size }), className)}
      >
        {children}
      </div>
    );
  },
);
