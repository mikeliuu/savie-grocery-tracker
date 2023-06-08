import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { classMerge } from "@/lib/utils";

export const buttonToggleGroupVariants = cva(
  "grid grid-flow-col gap-1 p-1 mx-auto bg-gray-100 rounded-lg ",
);

export type ButtonToggleGroupItem = {
  label: React.ReactNode;
  key: string;
  onClick: () => void;
};

export interface ButtonToggleGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonToggleGroupVariants> {
  group: ButtonToggleGroupItem[];
  defaultKey?: string;
}

export const ButtonToggleGroup = React.forwardRef<
  HTMLDivElement,
  ButtonToggleGroupProps
>(({ group = [], defaultKey = "", className, ...props }, ref) => {
  const [activeKey, setActiveKey] = React.useState(defaultKey || group[0]?.key);

  const clickActiveButton = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div
      ref={ref}
      {...props}
      className={classMerge(buttonToggleGroupVariants(), className)}
      role="group"
    >
      {group?.map((item, index) => {
        return (
          <button
            key={index}
            type="button"
            className={classMerge(
              "px-5 py-1.5 text-xs font-medium rounded-lg",
              {
                "text-white bg-gray-900":
                  activeKey === item?.key,
                "text-gray-900 hover:bg-gray-200  ":
                  activeKey !== item?.key,
              },
            )}
            onClick={() => {
              item?.onClick();

              clickActiveButton(item?.key);
            }}
          >
            {item?.label}
          </button>
        );
      })}
    </div>
  );
});
