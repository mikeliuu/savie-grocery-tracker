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
import { SelectAndCreateModal } from "./select-and-create-modal";

export interface SelectCategoryModalProps extends Omit<ModalProps, "children"> {
  value: RadioGroupsProps["value"];
  onChange: RadioGroupsProps["onChange"];
}

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

const convertOptionObject = (list?: { name: string; id: number }[]) =>
  (list &&
    list?.map((item) => ({ name: item?.name, value: item?.id?.toString() }))) ||
  [];

export function SelectCategoryModal({
  className,
  open = false,
  onClose,
  value,
  loading,
  onChange,
  ...props
}: SelectCategoryModalProps) {
  const [isCreateSection, setCreateSection] = useState(false);

  const goToCreateSection = () => {
    setCreateSection(true);
  };

  const backToSelection = () => {
    setCreateSection(false);

    reset();
  };

  const [trigger, { data, isLoading }] = useLazyGetCategoriesQuery();

  const [createCategory, { isLoading: isCreateLoading }] =
    useCreateCategoryMutation();

  const defaultOption: RadioGroupOption = {
    name: "No Category",
    value: "",
  };

  const options: RadioGroupsProps["options"] = convertOptionObject(data);

  const mergedOptions = defaultOption ? [defaultOption, ...options] : options;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
  });

  const handleCreate: SubmitHandler<CreateCategoryFormData> = async (
    data,
    events,
  ) => {
    await createCategory(data);

    backToSelection();
  };

  const createSection = (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>

        <Input
          type="text"
          id="name"
          placeholder="New category"
          disabled={isLoading || isCreateLoading}
          helperText={errors?.name?.message}
          error={!!errors?.name}
          {...register("name")}
        />
      </div>

      <div>
        <Button
          type="submit"
          variant="submit"
          disabled={isCreateLoading}
          loading={isCreateLoading}
          onClick={handleSubmit(handleCreate)}
        >
          Create
        </Button>
      </div>
    </form>
  );

  return (
    open && (
      <SelectAndCreateModal
        {...props}
        loading={loading || isCreateLoading}
        isCreateType={isCreateSection}
        className={classMerge("max-h-[60%] h-full", className)}
        heading={isCreateSection ? "Create Category" : "Select Category"}
        open={open}
        options={mergedOptions}
        value={value!}
        createSection={createSection}
        onClose={onClose}
        onBack={backToSelection}
        onCreate={goToCreateSection}
        onFetch={() => trigger(null)}
        onChange={(selected) => {
          onChange(selected);
        }}
      />
    )
  );
}
