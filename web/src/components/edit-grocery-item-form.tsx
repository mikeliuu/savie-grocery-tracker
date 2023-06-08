import React, { useState } from "react";
import { classMerge } from "@/lib/utils";

import { Button } from "./ui/button";
import { grocerySchema } from "@/lib/validations/grocery";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useUpdateGroceryItemMutation } from "@/redux/services/groceryApi";
import { GroceryItem, UpdateGroceryItem } from "@/lib/types/grocery";
import Collapse from "./ui/collapse";
import { Datepicker } from "./ui/datepicker";
import { SelectLocationModal } from "./select-location-modal";
import { Badge } from "./ui/badge";

interface EditGroceryItemFormProps {
  data: GroceryItem;
  className?: string;
  onSubmit?: () => void;
}

const editGroceryItemSchema = grocerySchema
  .omit({ category: true })
  .partial({ name: true });

type EditGroceryItemFormData = z.infer<typeof editGroceryItemSchema>;

export default function EditGroceryItemForm({
  data: itemData,
  className,
  onSubmit,
}: EditGroceryItemFormProps) {
  const [updateGroceryItem, { isLoading: isUpdateLoading }] =
    useUpdateGroceryItemMutation();

  const [openLocationModal, setOpenLocationModal] = useState(false);

  const {
    control,
    reset,
    watch,
    getValues,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditGroceryItemFormData>({
    resolver: zodResolver(editGroceryItemSchema),
  });

  const expiryDateValue = watch("expiryDate");
  const locationValue = watch("location");

  const handleOpenLocationModal = () => {
    setOpenLocationModal(true);
  };

  const handleUpdate: SubmitHandler<EditGroceryItemFormData> = async (
    { name, ...data },
    events,
  ) => {
    events?.preventDefault();

    const payload: UpdateGroceryItem = {
      // name,
      barcode: data?.barcode || "",
      vendor: data?.vendor || "",
      expiryDate: data?.expiryDate || null,
      locationId: +data?.location?.value!,
      price: +data?.price!,
      quantity: +data?.quantity!,
    };

    await updateGroceryItem({
      groceryId: itemData?.groceryId!,
      groceryItemId: itemData?.id!,
      payload,
    }).then((res) => {
      if (Object.keys(res)?.includes("error")) return;

      if (onSubmit) onSubmit();

      reset();
    });
  };

  const isLoading = isUpdateLoading;

  const MIN_QUANTITY = 1;

  return (
    <div className={classMerge("space-y-4 md:space-y-6 p-4 pb-8", className)}>
      <form className="space-y-4" onSubmit={handleSubmit(handleUpdate)}>
        <div>
          <Label htmlFor="name">Name</Label>

          <Input type="text" id="name" disabled value={itemData?.name} />
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

                  {itemData?.categoryName ? (
                    <Badge
                      variant="default"
                      size="md"
                      className="inline-flex relative"
                      spanClass="px-4 py-2 flex-none"
                    >
                      {itemData?.categoryName}
                    </Badge>
                  ) : (
                    <p className="text-gray-500 text-sm">No Category</p>
                  )}
                </div>

                <div className="w-full">
                  <Label htmlFor="location">Location</Label>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(event) => {
                      event.preventDefault();
                      handleOpenLocationModal();
                    }}
                    disabled={isLoading}
                  >
                    {locationValue ? locationValue?.name : "Select Location"}
                  </Button>

                  <SelectLocationModal
                    open={openLocationModal}
                    onClose={() => setOpenLocationModal(false)}
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
            loading={isUpdateLoading}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
