import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { classMerge } from "@/lib/utils";
import { Icons } from "./icon";

export const buttonVariants = cva(
  "font-medium rounded-lg px-5 py-2.5 inline-flex justify-center items-center rounded-md text-sm transition-colors outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        initial: "",
        default: "text-white bg-primary-600 hover:bg-primary-700",
        outline:
          "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100",
        light: "text-gray-500  hover:bg-gray-100 p-1.5",
        secondary: "text-gray-900 bg-white",
        info: "text-white bg-blue-500 hover:bg-blue-700",
        link: "border-none underline-offset-4 text-primary hover:bg-gray-100 ",
        square: "text-black  p-2",
        submit:
          "text-white bg-primary-600 hover:bg-primary-700 w-full xs:w-1/3 mt-4",
      },
      size: {
        initial: "",
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingClass?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { loading, loadingClass, className, variant, size, children, ...props },
    ref,
  ) => {
    return (
      <button
        className={classMerge(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading && (
          <Icons.spinner
            className={classMerge("mr-2 h-4 w-4 animate-spin", loadingClass)}
          />
        )}

        {children}
      </button>
    );
  },
);
