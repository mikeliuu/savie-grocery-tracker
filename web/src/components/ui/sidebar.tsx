import React, { HTMLAttributes } from "react";
import { Link, useLocation } from "react-router-dom";
import { classMerge, isNavActive } from "@/lib/utils";
import { MenuAction } from "@/layouts/menu-layout";

interface SideBarProps extends HTMLAttributes<HTMLDivElement> {
  menu: MenuAction[];
}

export default function SideBar({ className, menu }: SideBarProps) {
  return (
    <aside
      id="default-sidebar"
      aria-label="Sidebar"
      className={classMerge(
        "fixed top-0 left-0 z-40 w-60 h-screen transition-transform -translate-x-full md:translate-x-0",
        className,
      )}
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200">
        <ul className="space-y-4 font-medium">
          {menu?.map((item, index) => {
            const isLink = !!item?.to;

            const itemClass = classMerge(
              "cursor-pointer flex items-center no-underline p-2 text-gray-900 rounded-lg  hover:bg-gray-100 ",
              { "font-extrabold": isLink && isNavActive(item?.to!) },
            );

            return (
              <li key={index}>
                {isLink ? (
                  <Link to={item?.to!} className={itemClass}>
                    {item?.icon}

                    <span className="ml-3">{item?.label}</span>
                  </Link>
                ) : (
                  <a className={itemClass} onClick={item?.onClick}>
                    {item?.icon}

                    <span className="ml-3">{item?.label}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
