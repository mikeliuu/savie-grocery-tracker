import { Disclosure } from "@headlessui/react";
import { Icons } from "./icon";
import { classMerge } from "@/lib/utils";

interface CollapseProps {
  collapseClass?: string;
  className?: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

export default function Collapse({
  collapseClass,
  className,
  label,
  children,
}: CollapseProps) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classMerge(
              "flex w-full justify-between rounded-lg bg-gray-100 px-4 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-200",
              collapseClass,
            )}
          >
            <span>{label}</span>
            <Icons.chevronDown
              className={`${
                open ? "rotate-180 transform" : ""
              } h-5 w-5 text-gray-500 transition-all`}
            />
          </Disclosure.Button>

          <Disclosure.Panel
            className={classMerge(
              "px-4 pt-4 pb-2 mt-2 text-sm text-gray-500 rounded-lg transition-all",
              className,
            )}
          >
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
