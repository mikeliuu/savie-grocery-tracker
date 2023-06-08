import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Icons } from "./icon";
import { classMerge } from "@/lib/utils";
import { Skeleton } from "./skeleton";

const plans = [
  {
    name: "Startup",
    ram: "12GB",
    cpus: "6 CPUs",
    disk: "160 GB SSD disk",
  },
  {
    name: "Startup",
    ram: "12GB",
    cpus: "6 CPUs",
    disk: "160 GB SSD disk",
  },
  {
    name: "Startup",
    ram: "12GB",
    cpus: "6 CPUs",
    disk: "160 GB SSD disk",
  },
  {
    name: "Startup",
    ram: "12GB",
    cpus: "6 CPUs",
    disk: "160 GB SSD disk",
  },
  {
    name: "Business",
    ram: "16GB",
    cpus: "8 CPUs",
    disk: "512 GB SSD disk",
  },
  {
    name: "Enterprise",
    ram: "32GB",
    cpus: "12 CPUs",
    disk: "1024 GB SSD disk",
  },
  {
    name: "Business",
    ram: "16GB",
    cpus: "8 CPUs",
    disk: "512 GB SSD disk",
  },
  {
    name: "Enterprise",
    ram: "32GB",
    cpus: "12 CPUs",
    disk: "1024 GB SSD disk",
  },
];

export interface RadioGroupOption {
  name: string;
  value: string;
}

export interface RadioGroupsProps {
  loading?: boolean;
  checkedIconEnabled?: boolean;
  options: RadioGroupOption[];
  value: RadioGroupOption;
  onChange: (selected: RadioGroupOption) => void;
}

export default function RadioGroups({
  loading = false,
  checkedIconEnabled = false,
  options = [],
  value,
  onChange,
}: RadioGroupsProps) {
  return (
    <div role="radiogroup" className="">
      <div role="none" className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="mb-2" />
            <Skeleton count={2} lineClass="w-80" />
          </>
        ) : (
          options?.map((option, index) => {
            const checked = JSON.stringify(value) === JSON.stringify(option);

            return (
              <div
                key={index}
                role="radio"
                aria-checked={checked}
                onClick={() => {
                  onChange(option);
                }}
                className={classMerge(
                  "relative flex cursor-pointer focus:outline-none bg-white rounded-lg px-4 py-3 border border-gray-300 hover:border-gray-300 hover:bg-gray-200",
                  {
                    "border-primary-600 bg-primary-600 hover:border-primary-600 hover:bg-primary-600 text-white":
                      checked,
                  },
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p
                        className={classMerge("font-medium text-gray-900", {
                          "text-white": checked,
                        })}
                      >
                        {option?.name}
                      </p>
                    </div>
                  </div>

                  {checkedIconEnabled && checked && (
                    <div className="shrink-0 text-white">
                      <Icons.check className="h-5 w-5 text-medium" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>

    // <RadioGroup
    //   value={selected}
    //   onChange={(val) => {
    //     onChange(val);

    //     setSelected(val);
    //   }}
    // >
    //   <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>

    //   <div className="space-y-2">
    //     {options?.map((option, index) => (
    //       <RadioGroup.Option
    //         key={index}
    //         value={option}
    //         className={({ active, checked }) =>
    //           classMerge(
    //             "relative flex cursor-pointer rounded-lg px-4 py-2.5 border border-gray-300 focus:outline-none bg-white",
    //             { "border-primary-600 bg-primary-600 text-white": checked },
    //           )
    //         }
    //       >
    //         {({ active, checked }) => {
    //           return (
    //             <>
    //               <div className="flex w-full items-center justify-between">
    //                 <div className="flex items-center">
    //                   <div className="text-sm">
    //                     <RadioGroup.Label
    //                       as="p"
    //                       className={`font-medium  ${
    //                         checked ? "text-white" : "text-gray-900"
    //                       }`}
    //                     >
    //                       {option?.name}
    //                     </RadioGroup.Label>
    //                   </div>
    //                 </div>

    //                 {checkedIconEnabled && checked && (
    //                   <div className="shrink-0 text-white">
    //                     <Icons.check className="h-5 w-5 text-medium" />
    //                   </div>
    //                 )}
    //               </div>
    //             </>
    //           );
    //         }}
    //       </RadioGroup.Option>
    //     ))}
    //   </div>
    // </RadioGroup>
  );
}
