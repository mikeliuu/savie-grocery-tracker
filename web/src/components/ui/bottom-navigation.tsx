import React, { HTMLAttributes } from "react";
import { classMerge, isNavActive } from "@/lib/utils";
import { Icons } from "./icon";
import { MenuAction } from "@/layouts/menu-layout";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

interface BottomNavigationProps extends HTMLAttributes<HTMLDivElement> {
  menu: MenuAction[];
}

export default function BottomNavigation({
  className,
  menu,
}: BottomNavigationProps) {
  const navigate = useNavigate();

  return (
    <div
      className={classMerge(
        "fixed bottom-0 left-0 z-30 w-full h-14 bg-white border-t border-gray-200   transition-transform-translate-y-0 md:translate-y-full",
        className,
      )}
    >
      <div
        className={`grid h-full max-w-lg grid-cols-${menu?.length} mx-auto font-medium`}
      >
        {menu?.map((item, index) => {
          const isLink = !!item?.to;

          return (
            <Button
              key={index}
              type="button"
              variant="secondary"
              onClick={() =>
                isLink ? navigate(item?.to!) : item?.onClick && item?.onClick()
              }
              className={classMerge(
                "group inline-flex flex-col items-center justify-center h-full px-5 hover:bg-gray-50 rounded-none",
                {
                  "border-t-black border-t-4": isLink && isNavActive(item?.to!),
                },
              )}
            >
              {item?.icon}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
