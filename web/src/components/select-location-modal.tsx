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

export interface SelectLocationModalProps extends Omit<ModalProps, "children"> {
  value: RadioGroupsProps["value"];
  onChange: RadioGroupsProps["onChange"];
}

type CreateLocationFormData = z.infer<typeof createLocationSchema>;

const convertOptionObject = (list?: { name: string; id: number }[]) =>
  (list &&
    list?.map((item) => ({ name: item?.name, value: item?.id?.toString() }))) ||
  [];

export function SelectLocationModal({
  className,
  open = false,
  onClose,
  value,
  loading,
  onChange,
  ...props
}: SelectLocationModalProps) {
  const [isCreateSection, setCreateSection] = useState(false);

  const [trigger, { data, isLoading }] = useLazyGetLocationsQuery();

  const [createLocation, { isLoading: isCreateLoading }] =
    useCreateLocationMutation();

  const defaultOption: RadioGroupOption = {
    name: "No Location",
    value: "",
  };

  const options: RadioGroupsProps["options"] = convertOptionObject(data);

  const mergedOptions = defaultOption ? [defaultOption, ...options] : options;

  const goToCreateSection = () => {
    setCreateSection(true);
  };

  const backToSelection = () => {
    setCreateSection(false);
    reset();
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLocationFormData>({
    resolver: zodResolver(createLocationSchema),
  });

  const handleCreate: SubmitHandler<CreateLocationFormData> = async (
    data,
    events,
  ) => {
    await createLocation(data);

    backToSelection();
  };

  useEffect(() => {
    if (!open) return;

    trigger(null);
  }, [open]);

  const createSection = (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">Location Name</Label>

        <Input
          type="text"
          id="name"
          placeholder="New location"
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
        heading={isCreateSection ? "Create Location" : "Select Location"}
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
