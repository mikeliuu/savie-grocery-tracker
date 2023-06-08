import React, { useEffect, useState } from "react";
import { Modal, ModalProps } from "./ui/modal";
import { Icons } from "./ui/icon";
import RadioGroups, {
  RadioGroupOption,
  RadioGroupsProps,
} from "./ui/radio-groups";
import { classMerge } from "@/lib/utils";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
} from "@/redux/services/categoryApi";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { z } from "zod";
import { createCategorySchema } from "@/lib/validations/category";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";

export interface SelectAndCreateModalProps
  extends Omit<ModalProps, "children"> {
  options: RadioGroupsProps["options"];
  value: RadioGroupsProps["value"];
  onChange: RadioGroupsProps["onChange"];
  createSection?: React.ReactNode;
  isCreateType?: boolean;
  onBack?: () => void;
  onCreate?: () => void;
  onFetch?: () => void;
}

export function SelectAndCreateModal({
  className,
  heading = "Select",
  open = false,
  onClose,
  createSection,
  loading = false,
  options = [],
  value,
  isCreateType = false,
  onChange,
  onBack,
  onCreate,
  onFetch,
  ...props
}: SelectAndCreateModalProps) {
  const handleClose = () => {
    onClose();
    if (onBack) onBack();
  };

  useEffect(() => {
    if (!open) return;

    if (onFetch) onFetch();
  }, [open]);

  return (
    <Modal
      {...props}
      className={classMerge("max-h-[60%] h-full", className)}
      heading={heading}
      leftAction={
        isCreateType
          ? {
              label: isCreateType ? <Icons.chevronLeft /> : <Icons.pencil />,
              onClick: () =>
                isCreateType ? onBack && onBack() : onCreate && onCreate(),
            }
          : null
      }
      rightAction={{
        label: <Icons.close />,
        onClick: onClose,
      }}
      open={open}
      onClose={handleClose}
    >
      <div className="relactive px-6 py-8">
        {isCreateType ? (
          createSection
        ) : (
          <RadioGroups
            loading={loading}
            checkedIconEnabled
            options={options}
            value={value!}
            onChange={(selected) => {
              onChange(selected);

              onClose();
            }}
          />
        )}
      </div>
    </Modal>
  );
}
