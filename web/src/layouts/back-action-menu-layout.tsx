import { Icons } from "@/components/ui/icon";
import React from "react";
import { MenuLayoutProps } from "./menu-layout";
import { useNavigate } from "react-router-dom";
import ActionMenuLayout, {
  ActionMenuLayoutProps,
  MenuLayoutAction,
} from "./action-menu-layout";

export interface BackActionMenuLayoutProps extends ActionMenuLayoutProps {
  heading?: React.ReactNode;
}

export default function BackActionMenuLayout({
  children,
  ...props
}: BackActionMenuLayoutProps) {
  const navigate = useNavigate();

  const backAction: MenuLayoutAction = {
    label: <Icons.chevronLeft />,
    onClick: () => navigate(-1),
  };

  return (
    <ActionMenuLayout {...props} leftAction={backAction}>
      {children}
    </ActionMenuLayout>
  );
}
