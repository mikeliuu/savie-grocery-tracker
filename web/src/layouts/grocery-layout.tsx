import React from "react";
import MenuLayout, { MenuLayoutProps } from "./menu-layout";
import { classMerge } from "@/lib/utils";

export interface GroceryLayoutProps extends MenuLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  headerClass?: string;
  footerClass?: string;
}

export default function GroceryLayout({
  header,
  footer,
  headerClass,
  footerClass,
  className,
  children,
  ...props
}: GroceryLayoutProps) {
  return (
    <>
      <MenuLayout
        className={classMerge("p-0 mb-14 md:mb-28", className)}
        {...props}
      >
        <div className="z-40 fixed top-0 left-0 md:ml-60 md:w-[calc(100%-15rem)] w-full bg-white">
          <div
            className={classMerge(
              "max-w-lg md:max-w-xl mx-auto p-4 px-8",
              headerClass,
            )}
          >
            {header}
          </div>
        </div>

        {children}

        <div className="z-40 fixed bottom-16 md:bottom-4 left-0 md:ml-60 md:w-[calc(100%-15rem)] w-full">
          <div
            className={classMerge(
              "flex items-center justify-center max-w-lg md:max-w-xl mx-auto p-4 px-8",
              footerClass,
            )}
          >
            {footer}
          </div>
        </div>
      </MenuLayout>
    </>
  );
}
