import React, { useState } from "react";
import { Avatar } from "./ui/avatar";
import { User } from "@/lib/types/user";
import { classMerge } from "@/lib/utils";
import { Dropdown, DropdownProps } from "./ui/dropdown";
import { useAuthToken } from "@/lib/hooks/auth";
import { Modal } from "./ui/modal";
import { Icons } from "./ui/icon";
import { Button, buttonVariants } from "./ui/button";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import AppRoutes from "@/lib/routes";

interface UserProfileCardProps {
  className?: string;
  loading?: boolean;
  data?: User;
}

export default function UserProfileCard({
  className,
  loading = false,
  data,
}: UserProfileCardProps) {
  const { logout } = useAuthToken();

  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  const userInitial = data?.name?.charAt(0);

  const handleProfileModalToggle = () => {
    setOpenProfileMenu((state) => !state);
  };

  const profileMenu: DropdownProps["menu"] = [
    {
      label: "Edit profile",
      type: "link",
      to: AppRoutes.EditProfile,
    },
    {
      label: "Sign out",
      type: "div",
      onClick: logout,
    },
    {
      label: "Cancel",
      type: "div",
      onClick: handleProfileModalToggle,
    },
  ];

  return (
    <>
      <Modal
        open={openProfileMenu}
        onClose={() => setOpenProfileMenu(false)}
        className="w-screen"
      >
        <ul className="max-w-full-lg text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dar">
          {profileMenu?.map((menu, index) => {
            const isLinkElement = menu?.type === "link";

            const menuClass =
              "w-full p-4 font-medium text-sm text-center cursor-pointer border-b border-gray-200 rounded-t-lg ";

            return (
              <li key={index} className="flex">
                {isLinkElement ? (
                  <Link to={menu?.to!} className={menuClass}>
                    {menu?.label}
                  </Link>
                ) : (
                  <div className={menuClass} onClick={menu?.onClick}>
                    {menu?.label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Modal>

      <Card size="initial" variant="static" className={className}>
        <div className="flex justify-end px-4 pt-4">
          <Button
            variant="secondary"
            className="relative inline-flex p-2"
            disabled={loading}
            onClick={handleProfileModalToggle}
          >
            <span className="sr-only">Open Profile Menu</span>
            <Icons.ellipsisX />
          </Button>
        </div>

        <div className="flex flex-col items-center pb-10">
          <Avatar size="lg" className="mb-2 text-xl">
            {loading ? <Skeleton lineClass="h-full w-full" /> : userInitial}
          </Avatar>

          <h5 className="mb-1 text-xl font-medium text-gray-900 ">
            {loading ? <Skeleton /> : data?.name}
          </h5>

          <span className="text-sm text-gray-500 ">
            {loading ? <Skeleton /> : data?.email}
          </span>
        </div>
      </Card>
    </>
  );
}
