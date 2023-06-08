import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { classMerge } from "@/lib/utils";

export const buttonGroupVariants = cva("inline-flex rounded-full shadow-sm");

export interface ButtonGroupItem {
  label: React.ReactNode;
  onClick: () => void;
}

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  group: ButtonGroupItem[];
  buttonClass?: string;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ group = [], buttonClass, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={classMerge(buttonGroupVariants(), className)}
        role="group"
      >
        {group?.map((item, index) => {
          const isFirstItem = index === 0;
          const isLastItem = index === group.length - 1;

          return (
            <button
              key={index}
              type="button"
              onClick={item?.onClick}
              className={classMerge(
                "flex flex-row items-center jusitfy-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-gray-200  hover:bg-gray-100",
                {
                  "border rounded-l-full": isFirstItem,
                  "border-t border-b": !isFirstItem && !isLastItem,
                  "border rounded-r-full": isLastItem,
                },
                buttonClass,
              )}
            >
              {item?.label}
            </button>
          );
        })}
      </div>
    );
  },
);
