import React from "react";
import MenuLayout from "@/layouts/menu-layout";
import { useGetUserInfoQuery } from "@/redux/services/userApi";
import UserProfileCard from "@/components/user-profile-card";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icon";
import AppRoutes from "@/lib/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { classMerge } from "@/lib/utils";

export default function Profile() {
  const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserInfoQuery(
    {},
  );

  const profileList = [
    {
      label: "Account",
      to: AppRoutes.ProfileAccount,
    },
    {
      label: "Help",
      to: "mailto:noreply.grocerytrackerapp@gmail.com?subject=Help Request on Saive - Grocery Tracker",
    },
    {
      label: "Disclaimer",
      to: AppRoutes.Disclaimer,
    },
  ];

  return (
    <MenuLayout>
      <div className="grid grid-cols-1 gap-5">
        <UserProfileCard
          className="mb-2"
          loading={isUserInfoLoading}
          data={userInfo}
        />

        <ul className="shadow max-w-full-lg text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg   ">
          {profileList?.map((menu, index) => {
            const menuClass =
              "w-full p-4 font-medium text-sm flex items-center jusitfy-between cursor-pointer border-b border-gray-200  hover:bg-gray-100";

            return (
              <li key={index} className="flex">
                <Link
                  to={menu?.to!}
                  className={classMerge(menuClass, {
                    "hover:bg-inherit": isUserInfoLoading,
                  })}
                >
                  {isUserInfoLoading ? (
                    <Skeleton lineClass="h-4 w-full" />
                  ) : (
                    <>
                      {menu?.label}

                      <Icons.chevronRight className="ml-auto text-gray-900" />
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </MenuLayout>
  );
}
