import React, { useMemo } from "react";
import {
  useDeleteGroceryItemMutation,
  useDeleteGroceryMutation,
  useGetGroceryItemQuery,
  useGetGroceryQuery,
  useResotreGroceryItemMutation,
  useResotreGroceryMutation,
} from "@/redux/services/groceryApi";
import { useNavigate, useParams } from "react-router-dom";
import GroceryLayout from "@/layouts/grocery-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/ui/icon";
import HeaderActions from "@/components/ui/header-actions";
import { MenuLayoutAction } from "@/layouts/action-menu-layout";
import { classMerge, getGroceryInfoMessage } from "@/lib/utils";
import useToggle from "@/lib/hooks/useToggle";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import EditGroceryItemForm from "@/components/edit-grocery-item-form";

export default function GroceryItemDetail() {
  const navigate = useNavigate();

  const { groceryId = "", groceryItemId = "" } = useParams();

  const payloadIds = {
    groceryId: parseInt(groceryId, 10),
    groceryItemId: parseInt(groceryItemId, 10),
  };

  const {
    open: openDeletePopup,
    toggleOpen: toggleOpenDeletePopup,
    toggleClose: toggleCloseDeletePopup,
  } = useToggle();

  const { data: groceryItemData, isLoading: isGroceryItemLoading } =
    useGetGroceryItemQuery(payloadIds);

  const [deleteGroceryItem, { isLoading: isDeleteLoading }] =
    useDeleteGroceryItemMutation();

  const [retoreGroceryItem, { isLoading: isRetoreLoading }] =
    useResotreGroceryItemMutation();

  const backAction: MenuLayoutAction = {
    label: <Icons.chevronLeft />,
    onClick: () => navigate(-1),
  };

  const deleteAction: MenuLayoutAction = {
    label: (
      <Icons.trash
        className={classMerge("w-[1.25rem] h-[1.25rem] text-red-700", {
          "pointer-events-none text-gray-300": !!groceryItemData?.deletedAt,
        })}
      />
    ),
    onClick: toggleOpenDeletePopup,
  };

  const backToItemDetail = () => {
    navigate(-1);
  };

  const handleDeleteItem = () => {
    deleteGroceryItem(payloadIds).then((res) => {
      if (Object.keys(res)?.includes("error")) return;

      toggleCloseDeletePopup();

      toast(
        (t) => {
          return (
            <span className="flex flex-row flex-wrap items-center ">
              <b className="text-black text-sm mr-4">Successfully deleted!</b>
              <Button
                variant="outline"
                className="cursor-pointer border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                onClick={async () => {
                  toast.dismiss(t.id);
                  await handleRetoreGrocery();
                }}
              >
                Restore
              </Button>
            </span>
          );
        },
        {
          duration: 5000,
        },
      );
    });
  };

  const handleRetoreGrocery = () => {
    retoreGroceryItem(payloadIds);
  };

  const detailHeader = (
    <>
      <HeaderActions
        heading="Grocery Item Detail"
        leftAction={backAction}
        rightAction={deleteAction}
        disabled={isGroceryItemLoading || isDeleteLoading || isRetoreLoading}
      />

      <div className="px-8 mt-4">
        {isGroceryItemLoading && (
          <>
            <Skeleton lineClass="w-80 mb-6" />

            <Skeleton count={3} />
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      <Modal
        bodyClass="p-8"
        heading="Delete item?"
        open={openDeletePopup}
        onClose={toggleCloseDeletePopup}
      >
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-500 text-md font-normal">
            If you delete, your item won't be reverted.
          </p>

          <div className="flex flex-row items-center justify-center w-full mt-8">
            <Button
              type="button"
              variant="outline"
              className="text-white bg-red-600 hover:bg-red-800 font-medium border-red-600 w-full mr-2"
              onClick={handleDeleteItem}
            >
              Delete
            </Button>

            <Button
              type="button"
              variant="outline"
              className="text-gray-500 hover:text-gray-900 w-full font-medium"
              onClick={toggleCloseDeletePopup}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <GroceryLayout headerClass="p-0" header={detailHeader}>
        <div className="px-8 grid grid-cols-1 gap-4 mt-20 mb-24 md:mb-0">
          {isGroceryItemLoading ? (
            <div>
              <Skeleton lineClass="w-1/4" />
              <Skeleton count={3} lineClass="w-2/3" />
            </div>
          ) : !Object.keys(groceryItemData!).length ? (
            <div className="w-full h-full flex justify-center items-center flex-col mb-16">
              <Icons.alertCircle className="w-24 h-24 text-gray-300 mb-4" />

              <p className="font-medium text-gray-300 text-xl text-center">
                Item not found
              </p>
            </div>
          ) : (
            <div className="relative text-gray-900">
              <div className="space-y-4">
                <EditGroceryItemForm
                  data={groceryItemData!}
                  onSubmit={backToItemDetail}
                />
              </div>
            </div>
          )}
        </div>
      </GroceryLayout>
    </>
  );
}
