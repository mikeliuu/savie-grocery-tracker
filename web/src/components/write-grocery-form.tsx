import React, { useState } from "react";
import { classMerge } from "@/lib/utils";

import { Button } from "./ui/button";
import { grocerySchema } from "@/lib/validations/grocery";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useCreateGroceryMutation } from "@/redux/services/groceryApi";
import { CreateGrocery } from "@/lib/types/grocery";
import Collapse from "./ui/collapse";
import { Datepicker } from "./ui/datepicker";
import { SelectCategoryModal } from "./select-category-modal";
import { SelectLocationModal } from "./select-location-modal";
import useToggle from "@/lib/hooks/useToggle";

interface WriteGroceryFormProps {
  className?: string;
  onSubmit?: () => void;
}

type CreateGroceryFormData = z.infer<typeof grocerySchema>;

export default function WriteGroceryForm({
  className,
  onSubmit,
}: WriteGroceryFormProps) {
  const {
    open: openCategoryPopup,
    toggleOpen: toggleOpenCategoryPopup,
    toggleClose: toggleCloseCategoryPopup,
  } = useToggle();

  const {
    open: openLocationPopup,
    toggleOpen: toggleOpenLocationPopup,
    toggleClose: toggleCloseLocationPopup,
  } = useToggle();

  const [createGrocery, { isLoading: isCreateGroceryLoading }] =
    useCreateGroceryMutation();

  const {
    control,
    reset,
    watch,
    getValues,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroceryFormData>({
    resolver: zodResolver(grocerySchema),
  });

  const expiryDateValue = watch("expiryDate");
  const categoryValue = watch("category");
  const locationValue = watch("location");

  const handleCreate: SubmitHandler<CreateGroceryFormData> = async (
    { name, ...data },
    events,
  ) => {
    events?.preventDefault();

    const payload: CreateGrocery = {
      name,
      barcode: data?.barcode || "",
      vendor: data?.vendor || "",
      expiryDate: data?.expiryDate || null,
      categoryId: +data?.category?.value!,
      locationId: +data?.location?.value!,
      price: +data?.price!,
      quantity: +data?.quantity!,
    };

    await createGrocery(payload).then((res) => {
      if (Object.keys(res)?.includes("error")) return;

      if (onSubmit) onSubmit();

      reset();
    });
  };

  const isLoading = isCreateGroceryLoading;

  const MIN_QUANTITY = 1;

  return (
    <div className={classMerge("space-y-4 md:space-y-6 p-4 pb-8", className)}>
      <form className="space-y-4" onSubmit={handleSubmit(handleCreate)}>
        <div>
          <Label htmlFor="name">Name</Label>

          <Input
            type="text"
            id="name"
            placeholder="Grocery name"
            disabled={isLoading}
            helperText={errors?.name?.message}
            error={!!errors?.name}
            {...register("name")}
          />
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>

          <Input
            type="number"
            id="quantity"
            placeholder="Quantity"
            disabled={isLoading}
            helperText={errors?.quantity?.message}
            error={!!errors?.quantity}
            defaultValue={MIN_QUANTITY}
            min={MIN_QUANTITY}
            {...register("quantity")}
          />
        </div>

        <div>
          <Collapse label="Details" className="px-0">
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-4 xs:gap-8">
                <div className="w-full">
                  <Label htmlFor="category">Category</Label>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(event) => {
                      event.preventDefault();
                      toggleOpenCategoryPopup();
                    }}
                    disabled={isLoading}
                  >
                    {categoryValue ? categoryValue?.name : "Select Category"}
                  </Button>

                  <SelectCategoryModal
                    open={openCategoryPopup}
                    onClose={toggleCloseCategoryPopup}
                    onChange={(selected) => {
                      setValue("category", {
                        name: selected?.name,
                        value: selected?.value,
                      });
                    }}
                    value={getValues("category")!}
                  />
                </div>

                <div className="w-full">
                  <Label htmlFor="location">Location</Label>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(event) => {
                      event.preventDefault();
                      toggleOpenLocationPopup();
                    }}
                    disabled={isLoading}
                  >
                    {locationValue ? locationValue?.name : "Select Location"}
                  </Button>

                  <SelectLocationModal
                    open={openLocationPopup}
                    onClose={toggleCloseLocationPopup}
                    onChange={(selected) => {
                      setValue("location", {
                        name: selected?.name,
                        value: selected?.value,
                      });
                    }}
                    value={getValues("location")!}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>

                <div className="flex flex-row flex-nowrap w-full items-center justify-center">
                  <Button
                    variant={!expiryDateValue ? "default" : "outline"}
                    className={"flex-none mr-4"}
                    onClick={() => setValue("expiryDate", null)}
                  >
                    No expiry
                  </Button>

                  <Controller
                    control={control}
                    name="expiryDate"
                    render={({ field }) => (
                      <Datepicker
                        asSingle
                        useRange={false}
                        disabled={isLoading}
                        helperText={errors?.expiryDate?.message}
                        error={!!errors?.expiryDate}
                        value={{
                          startDate: field?.value!,
                          endDate: field?.value!,
                        }}
                        onChange={(date) => {
                          console.log({ date });
                          setValue("expiryDate", date?.startDate || null);
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="price">Total Price</Label>

                <Input
                  type="text"
                  id="price"
                  disabled={isLoading}
                  helperText={errors?.price?.message}
                  error={!!errors?.price}
                  defaultValue={0}
                  min={0}
                  {...register("price")}
                />
              </div>

              <div>
                <Label htmlFor="vendor">Vendor</Label>

                <Input
                  type="text"
                  id="vendor"
                  placeholder="Place you bought"
                  disabled={isLoading}
                  helperText={errors?.vendor?.message}
                  error={!!errors?.vendor}
                  {...register("vendor")}
                />
              </div>
            </div>
          </Collapse>
        </div>

        <div>
          <Button
            type="submit"
            variant="submit"
            disabled={isLoading}
            loading={isCreateGroceryLoading}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
