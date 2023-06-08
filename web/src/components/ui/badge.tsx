import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { classMerge } from "@/lib/utils";

export const badgeVariants = cva(
  "w-auto whitespace-nowrap font-medium px-2.5 py-2",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-800",
        error: "bg-red-100 text-red-800",
        info: "bg-blue-100 text-blue-800",
      },
      round: {
        full: "rounded-full",
        lg: "rounded-lg",
        md: "rounded-md",
        rounded: "rounded",
      },
      size: {
        default: "text-xs",
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      round: "lg",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  spanClass?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { icon, className, spanClass, variant, size, round, children, ...props },
    ref,
  ) => {
    return (
      <div className={classMerge(className)}>
        <span
          ref={ref}
          {...props}
          className={classMerge(
            badgeVariants({ variant, size, round }),
            spanClass,
          )}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </span>
      </div>
    );
  },
);
