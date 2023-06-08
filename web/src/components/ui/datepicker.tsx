import * as React from "react";

import { classMerge } from "@/lib/utils";
import TailwindDatepicker from "react-tailwindcss-datepicker";
import { DatepickerType } from "react-tailwindcss-datepicker/dist/types";
import { HelperText } from "./helper-text";
import { DateFormat } from "@/lib/constants";

export interface DatepickerProps extends DatepickerType {
  helperText?: React.ReactNode;
  error?: boolean;
}

export function Datepicker({
  helperText,
  error = false,
  containerClassName,
  inputClassName,
  displayFormat = DateFormat.DATE_FORMAT_WITH_MONTH,
  ...props
}: DatepickerProps) {
  return (
    <>
      <TailwindDatepicker
        {...props}
        displayFormat={displayFormat}
        primaryColor="emerald"
        containerClassName={classMerge(
          "datepicker relative w-full text-gray-700",
          containerClassName,
        )}
        inputClassName={classMerge(
          "relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full rounded-lg outline-none font-normal border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300",
          inputClassName,
        )}
      />

      {helperText && (
        <HelperText variant={error ? "error" : "default"}>
          {helperText}
        </HelperText>
      )}
    </>
  );
}
