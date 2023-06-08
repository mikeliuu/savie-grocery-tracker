import React, { useEffect, useState } from "react";
import { Icons } from "./icon";
import { classMerge } from "@/lib/utils";
import ClickAwayListener from "react-click-away-listener";
import useDebounce from "@/lib/hooks/useDebounce";

export interface SearchBarProps
  extends Omit<React.HTMLAttributes<HTMLInputElement>, "value"> {
  containerClass?: string;
  defaultValue?: string;
  onSearch: (search: string) => void;
}

export default function SearchBar({
  placeholder = "Search",
  containerClass,
  className,
  defaultValue = "",
  onSearch,
  ...props
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  const [search, setSearch] = useState("");

  const defferedSearch = useDebounce(search, 500);

  const handleClear: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();

    setSearch("");
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setSearch(value);
  };

  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.key === "Enter") {
      onSearch(defferedSearch);
    }

    if (event.key === "Escape") {
      setFocused(false);
    }
  };

  useEffect(() => {
    onSearch(defferedSearch);
  }, [defferedSearch, defaultValue]);

  return (
    <ClickAwayListener onClickAway={() => setFocused(false)}>
      <div
        className={classMerge("flex items-center", containerClass)}
        onClick={() => setFocused(true)}
      >
        <label htmlFor="search-bar" className="sr-only">
          Search
        </label>

        <div className="relative w-full">
          <div
            className={classMerge(
              "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
              {
                hidden: focused,
              },
            )}
          >
            <Icons.search className="w-5 h-5 text-gray-500" />
          </div>

          <input
            {...props}
            type="text"
            id="search-bar"
            className={classMerge(
              "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 pr-4 py-2.5 focus:border-gray-300 focus:ring-0 transition-all",
              {
                "px-4": focused,
              },
            )}
            placeholder={placeholder}
            value={search}
            onChange={handleChange}
            onKeyUp={handleKeyPress}
          />

          <div
            className={classMerge(
              "hidden absolute inset-y-0 right-0 items-center pr-3 cursor-pointer z-10",
              {
                flex: focused,
              },
              className,
            )}
            onClick={handleClear}
          >
            <Icons.close className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>
    </ClickAwayListener>
  );
}
