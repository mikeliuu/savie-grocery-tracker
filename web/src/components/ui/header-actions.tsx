import { Icons } from "@/components/ui/icon";
import React from "react";
import { Button } from "@/components/ui/button";
import { classMerge } from "@/lib/utils";

export interface MenuLayoutAction {
  label: React.ReactNode;
  onClick: () => void;
}

export interface HeaderActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  leftAction?: MenuLayoutAction | null;
  rightAction?: MenuLayoutAction | null;
  heading?: React.ReactNode;
  disabled?: boolean;
}

export default function HeaderActions({
  leftAction,
  rightAction,
  heading,
  className,
  disabled = false,
  ...props
}: HeaderActionsProps) {
  return (
    <div
      {...props}
      className={classMerge(
        "relative max-w-lg mx-auto w-full flex bg-white py-2 px-4",
        className,
      )}
    >
      {leftAction && (
        <Button
          onClick={leftAction?.onClick}
          variant="secondary"
          className="relative inline-flex p-2 mr-auto"
          disabled={disabled}
        >
          {leftAction?.label}
        </Button>
      )}

      {heading && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 m-auto font-semibold text-black">
          {heading}
        </div>
      )}

      {rightAction && (
        <Button
          onClick={rightAction?.onClick}
          variant="secondary"
          className="relative inline-flex p-2 ml-auto"
          disabled={disabled}
        >
          {rightAction?.label}
        </Button>
      )}
    </div>
  );
}
