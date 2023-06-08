import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { classMerge } from "@/lib/utils";

export const labelVariants = cva(
  "block mb-2 text-sm font-medium text-gray-900 ",
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        {...props}
        className={classMerge(labelVariants(), className)}
      >
        {children}
      </label>
    );
  },
);
