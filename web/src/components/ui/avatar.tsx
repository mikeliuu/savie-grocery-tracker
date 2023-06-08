import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { classMerge } from "@/lib/utils";

export const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-gray-100 ",
      },
      size: {
        default: "w-10 h-10",
        sm: "w-8 h-8",
        md: "w-14 h-14",
        lg: "w-16 h-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  iconClass?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      iconClass = "text-gray-600 ",
      variant,
      size,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className={classMerge(avatarVariants({ variant, size }), className)}
      >
        <span className={classMerge("font-medium font-lg", iconClass)}>{children}</span>
      </div>
    );
  },
);
