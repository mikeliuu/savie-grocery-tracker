import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { classMerge } from "@/lib/utils";

export const helperTextVariants = cva("font-normal", {
  variants: {
    variant: {
      default: "text-gray-500",
      error: "text-red-500",
      success: "text-green-500",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
});

export interface HelperTextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof helperTextVariants> {}

export const HelperText = React.forwardRef<HTMLSpanElement, HelperTextProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        {...props}
        className={classMerge(helperTextVariants({ variant, size }), className)}
      >
        {children}
      </span>
    );
  },
);
