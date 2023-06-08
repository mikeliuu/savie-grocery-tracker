import { classMerge } from "@/lib/utils";
import React from "react";

interface BaseLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function BaseLayout({
  className,
  children,
  ...props
}: BaseLayoutProps) {
  return (
    <div
      {...props}
      className={classMerge(
        "bg-gray-50 min-w-screen min-h-screen w-full h-full flex items-center justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
