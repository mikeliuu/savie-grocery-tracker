import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { classMerge } from "@/lib/utils";
import { HelperText } from "./helper-text";

export const inputVariants = cva(
  "bg-gray-50 disabled:bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-primary-600 focus-visible:border-primary-600 block w-full p-2.5",
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  helperText?: React.ReactNode;
  error?: boolean;
  type?: HTMLInputElement["type"];
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ helperText, error, className, type = "text", ...props }, ref) => {
    return (
      <>
        <input
          ref={ref}
          {...props}
          onKeyDown={(event) => {
            if (type === "number") {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }
          }}
          className={classMerge(inputVariants(), className)}
        />

        {helperText && (
          <HelperText variant={error ? "error" : "default"}>
            {helperText}
          </HelperText>
        )}
      </>
    );
  },
);
