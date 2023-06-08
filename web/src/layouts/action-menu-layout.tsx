import { Icons } from "@/components/ui/icon";
import React from "react";
import MenuLayout, { MenuLayoutProps } from "./menu-layout";
import { Button } from "@/components/ui/button";
import { classMerge } from "@/lib/utils";
import HeaderActions, {
  HeaderActionsProps,
} from "@/components/ui/header-actions";

export interface MenuLayoutAction {
  label: React.ReactNode;
  onClick: () => void;
}

export interface ActionMenuLayoutProps
  extends MenuLayoutProps,
    HeaderActionsProps {}

export default function ActionMenuLayout({
  leftAction,
  rightAction,
  heading,
  children,
  ...props
}: ActionMenuLayoutProps) {
  return (
    <MenuLayout {...props}>
      <div className=" bg-white w-full md:w-[calc(100%-15rem)] fixed left-0 md:left-[15rem] top-0 [&~*]:mt-16 [&~*]:mb-4 border-b-2 border-gray-100">
        <HeaderActions
          className="px-4 md:max-w-none md:mx-0 max-w-lg mx-auto"
          leftAction={leftAction}
          rightAction={rightAction}
          heading={heading}
        />
      </div>

      {children}
    </MenuLayout>
  );
}
