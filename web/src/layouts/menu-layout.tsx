import CreateGroceryModal from "@/components/create-grocery-modal";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { Icons } from "@/components/ui/icon";
import SideBar from "@/components/ui/sidebar";
import AppRoutes from "@/lib/routes";
import { classMerge } from "@/lib/utils";
import React, { useState } from "react";

export interface MenuLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  containerClass?: string;
}

export type MenuAction = {
  label?: string;
  icon: React.ReactNode;
  to?: AppRoutes;
  onClick?: () => void;
};

export default function MenuLayout({
  containerClass,
  className,
  children,
}: MenuLayoutProps) {
  const [openCreateGroceryModal, setOpenCreateGroceryModal] = useState(false);

  const menu: MenuAction[] = [
    {
      label: "Dashboard",
      icon: <Icons.home />,
      to: AppRoutes.Home,
    },
    {
      label: "Grocery List",
      icon: <Icons.stock />,
      to: AppRoutes.Groceries,
    },
    {
      label: "Add Grocery",
      icon: <Icons.addCircle />,
      // onClick: () => setOpenCreateGroceryModal(true), //todo: phase2
      to: AppRoutes.WriteGrocery,
    },
    // {
    //   label: "Settings",
    //   icon: <Icons.settings />,
    //   to: AppRoutes.Settings,
    // },
    {
      label: "Profile",
      icon: <Icons.profile />,
      to: AppRoutes.Profile,
    },
  ];

  return (
    <>
      {/* //todo: phase2  */}
      {/* {openCreateGroceryModal && (
        <CreateGroceryModal
          open={openCreateGroceryModal}
          onClose={() => setOpenCreateGroceryModal(false)}
        />
      )} */}

      <SideBar menu={menu} />

      <div className={classMerge("p-4 px-8 mb-14 md:mb-0 md:ml-60", className)}>
        <div
          className={classMerge(
            "max-w-lg md:max-w-xl  mx-auto",
            containerClass,
          )}
        >
          {children}
        </div>
      </div>

      <BottomNavigation menu={menu} />
    </>
  );
}
