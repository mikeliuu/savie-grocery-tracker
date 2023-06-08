import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Icons } from "./icon";
import { classMerge } from "@/lib/utils";
import { HelperText } from "./helper-text";

export interface SelectOption {
  name: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: SelectOption;
  onChange: (selected: SelectOption) => void;
  helperText?: React.ReactNode;
  error?: boolean;
  placeholder?: string;
}

export default function Select({
  helperText,
  error,
  options = [],
  value,
  placeholder = "Select",
  onChange,
}: SelectProps) {
  const DEFAULT_OPTION: SelectOption = {
    name: placeholder,
    value: "",
  };

  const [selectedOption, setSelectedOption] =
    useState<SelectOption>(DEFAULT_OPTION);

  return (
    <>
      <Listbox
        value={selectedOption}
        onChange={(val: SelectOption) => {
          setSelectedOption(val);

          onChange(val);
        }}
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300">
            <span
              className={classMerge("block text-gray-400", {
                "text-gray-900": value?.value,
              })}
            >
              {value?.name ? value?.name : DEFAULT_OPTION?.name}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icons.chevronsUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
              {options?.map((option, index) => {
                return (
                  <Listbox.Option
                    key={index}
                    className={({ active, selected }) =>
                      classMerge(
                        "relative cursor-default select-none py-2 px-4 text-gray-900",
                        { "bg-gray-100": active },
                        { "bg-gray-200": selected },
                      )
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <span
                        className={classMerge(
                          "block font-normal text-gray-900",
                          {
                            "font-semibold": selected,
                          },
                        )}
                      >
                        {option?.name}
                      </span>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {helperText && (
        <HelperText variant={error ? "error" : "default"}>
          {helperText}
        </HelperText>
      )}
    </>
  );
}
