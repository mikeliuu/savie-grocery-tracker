import React, { useEffect, useState } from "react";
import { Modal, ModalProps } from "./ui/modal";
import { Icons } from "./ui/icon";
import RadioGroups, {
  RadioGroupOption,
  RadioGroupsProps,
} from "./ui/radio-groups";
import { classMerge } from "@/lib/utils";
import {
  useCreateLocationMutation,
  useGetLocationsQuery,
  useLazyGetLocationsQuery,
} from "@/redux/services/locationApi";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { z } from "zod";
import { createLocationSchema } from "@/lib/validations/location";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { SelectAndCreateModal } from "./select-and-create-modal";
import { DEFAULT_SORT_OPTION } from "@/lib/constants";

export interface SelectSortModalProps extends Omit<ModalProps, "children"> {
  value: RadioGroupsProps["value"];
  onChange: RadioGroupsProps["onChange"];
}

export function SelectSortModal({
  className,
  heading = "Select Sort",
  open = false,
  onClose,
  value,
  loading,
  onChange,
  ...props
}: SelectSortModalProps) {
  const options = [
    DEFAULT_SORT_OPTION,
    {
      name: "Name",
      value: "name",
    },
    {
      name: "What's new",
      value: "new",
    },
    {
      name: "Expiry",
      value: "expiry",
    },
  ];

  return (
    open && (
      <SelectAndCreateModal
        {...props}
        className={classMerge("max-h-[35%] h-full", className)}
        heading={heading}
        open={open}
        options={options}
        value={value! || options[0]}
        onClose={onClose}
        onChange={(selected) => {
          onChange(selected);
        }}
      />
    )
  );
}
