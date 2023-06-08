import * as React from "react";

import { classMerge } from "@/lib/utils";
import ClickAwayListener from "react-click-away-listener";
import { Icons } from "./icon";
import { buttonVariants } from "./button";
import { Link } from "react-router-dom";

interface DropdownMunu {
  label: React.ReactNode;
  type: "link" | "div";
  to?: string;
  onClick?: () => void;
  className?: string;
}

export interface DropdownProps extends React.HTMLAttributes<HTMLButtonElement> {
  dropdownClass?: string;
  menu: DropdownMunu[];
}

export const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  ({ menu, dropdownClass = "", className, children, ...props }, ref) => {
    const [openDropdown, setOpenDropdown] = React.useState(false);

    const handleMenuToggle = () => {
      setOpenDropdown((state) => !state);
    };

    const hadleMenuClose = () => {
      setOpenDropdown(false);
    };

    return (
      <React.Fragment>
        <ClickAwayListener onClickAway={hadleMenuClose}>
          <button
            ref={ref}
            {...props}
            id="dropdownButton"
            data-dropdown-toggle="dropdown"
            onClick={handleMenuToggle}
            className={classMerge(
              buttonVariants({ variant: "light", size: "initial" }),
              className,
            )}
            type="button"
          >
            <span className="sr-only">Open dropdown</span>
            <Icons.ellipsisX />
          </button>
        </ClickAwayListener>

        <div
          id="dropdown"
          data-popper-placement="bottom"
          className={classMerge(
            dropdownClass,
            "z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ",
            `${openDropdown ? "block absolute top-20" : "hidden"}`,
          )}
        >
          <ul className="py-2" aria-labelledby="dropdownButton">
            {menu?.map((menuItem, index) => {
              const isLinkElement = menuItem?.type === "link";

              const itemClass = classMerge(
                menuItem?.className,
                "block px-4 py-2 cursor-pointer no-underline font-medium text-sm text-gray-700 hover:bg-gray-100",
              );

              return (
                <li key={index}>
                  {isLinkElement ? (
                    <Link to={menuItem.to!} className={itemClass}>
                      {menuItem?.label}
                    </Link>
                  ) : (
                    <div onClick={menuItem?.onClick} className={itemClass}>
                      {menuItem?.label}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </React.Fragment>
    );
  },
);
