import React, { Fragment } from "react";
import { Dialog, Transition, DialogProps } from "@headlessui/react";
import { classMerge } from "@/lib/utils";
import { Button } from "./button";
import { HeaderActionsProps } from "./header-actions";

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<DialogProps<any>, "onClose">,
    HeaderActionsProps {
  open: boolean;
  onClose: () => void;
  modalClass?: string;
  containerClass?: string;
  bodyClass?: string;
}

export function Modal({
  open = false,
  onClose,
  className,
  modalClass,
  containerClass,
  bodyClass,
  heading,
  leftAction,
  rightAction,
  children,
  ...props
}: ModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        {...props}
        as="div"
        className={classMerge("relative z-50", modalClass)}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-hidden">
          <div
            className={classMerge(
              "flex h-full min-h-full items-center justify-center p-4 text-center",
              containerClass,
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={classMerge(
                  "w-full max-w-md h-auto max-h-[80vh] overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transform transition-all",
                  { "pt-12 xs:pt-14": heading },
                  className,
                )}
              >
                {heading && (
                  <Dialog.Title className="z-10 fixed top-0 left-0 w-full bg-white border-b-[1px] border-gray-300 px-4 py-2.5 h-12 xs:h-14 flex items-center justify-center">
                    {leftAction && (
                      <Button
                        onClick={leftAction?.onClick}
                        variant="secondary"
                        className="relative inline-flex p-2 pl-0 mr-auto"
                      >
                        {leftAction?.label}
                      </Button>
                    )}

                    <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 m-auto font-semibold text-gray-900 text-lg text-center">
                      {heading}
                    </p>

                    {rightAction && (
                      <Button
                        onClick={rightAction?.onClick}
                        variant="secondary"
                        className="relative inline-flex p-2 pr-0 ml-auto"
                      >
                        {rightAction?.label}
                      </Button>
                    )}
                  </Dialog.Title>
                )}

                <div
                  className={classMerge(
                    "overflow-y-auto max-h-full h-full",
                    bodyClass,
                  )}
                >
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
