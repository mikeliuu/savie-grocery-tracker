import React, { useMemo } from "react";
import {
  useDeleteGroceryMutation,
  useGetGroceryQuery,
  useResotreGroceryMutation,
} from "@/redux/services/groceryApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import GroceryLayout from "@/layouts/grocery-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/ui/icon";
import HeaderActions from "@/components/ui/header-actions";
import { MenuLayoutAction } from "@/layouts/action-menu-layout";
import { classMerge, getGroceryInfoMessage } from "@/lib/utils";
import GroceryItemCard from "@/components/grocery-item-card";
import { Badge } from "@/components/ui/badge";
import AppRoutes from "@/lib/routes";
import useToggle from "@/lib/hooks/useToggle";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export default function GroceryDetail() {
  const navigate = useNavigate();

  const { groceryId = "" } = useParams();

  const payloadIds = {
    groceryId: parseInt(groceryId, 10),
  };

  const {
    open: openDeletePopup,
    toggleOpen: toggleOpenDeletePopup,
    toggleClose: toggleCloseDeletePopup,
  } = useToggle();

  const { data: groceryData, isLoading: isGroceryLoading } =
    useGetGroceryQuery(payloadIds);

  const [deleteGrocery, { isLoading: isDeleteLoading }] =
    useDeleteGroceryMutation();

  const [retoreGrocery, { isLoading: isRetoreLoading }] =
    useResotreGroceryMutation();

  const backAction: MenuLayoutAction = {
    label: <Icons.chevronLeft />,
    onClick: () => navigate(-1),
  };

  const deleteAction: MenuLayoutAction = {
    label: (
      <Icons.trash
        className={classMerge("w-[1.25rem] h-[1.25rem] text-red-700", {
          "pointer-events-none text-gray-300": !!groceryData?.deletedAt,
        })}
      />
    ),
    onClick: toggleOpenDeletePopup,
  };

  const handleDeleteGrocery = () => {
    deleteGrocery(payloadIds).then((res) => {
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
    retoreGrocery({ groceryId: parseInt(groceryId, 10) });
  };

  const infoMessage = useMemo(
    () => getGroceryInfoMessage(groceryData!),
    [groceryData],
  );

  const detailHeader = (
    <>
      <HeaderActions
        heading="Grocery Details"
        leftAction={backAction}
        rightAction={deleteAction}
        disabled={isGroceryLoading || isDeleteLoading || isRetoreLoading}
      />

      <div className="px-8 mt-4">
        {isGroceryLoading ? (
          <>
            <Skeleton lineClass="w-80 mb-6" />

            <Skeleton count={3} />
          </>
        ) : (
          <div>
            <div className="flex flex-row items-center">
              <p className="text-lg font-medium">{groceryData?.name}</p>

              {!!groceryData?.deletedAt && (
                <Badge
                  variant="error"
                  className=""
                  spanClass="px-2 py-1 flex-none ml-2"
                >
                  Deleted
                </Badge>
              )}
            </div>

            <p className="text-gray-500 text-sm">{infoMessage}</p>

            <div className="flex flex-row flex-wrap items-center my-4">
              <p className="text-black text-sm mr-1">Category:</p>

              {groceryData?.categoryName ? (
                <Badge
                  variant="default"
                  size="sm"
                  spanClass="px-2.5 py-1.5 flex-none"
                >
                  {groceryData?.categoryName}
                </Badge>
              ) : (
                <p className="text-gray-500 text-sm">No Category</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <Modal
        bodyClass="p-8"
        heading="Delete grocery?"
        open={openDeletePopup}
        onClose={toggleCloseDeletePopup}
      >
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-500 text-md font-normal">
            If you delete, your grocery won't be reverted.
          </p>

          <div className="flex flex-row items-center justify-center w-full mt-8">
            <Button
              type="button"
              variant="outline"
              className="text-white bg-red-600 hover:bg-red-800 font-medium border-red-600 w-full mr-2"
              onClick={handleDeleteGrocery}
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
          {isGroceryLoading ? (
            <div className="mt-28">
              <Skeleton lineClass="w-1/4" />
              <Skeleton count={3} lineClass="w-2/3" />
            </div>
          ) : !Object.keys(groceryData!).length ? (
            <div className="w-full h-full flex justify-center items-center flex-col mb-16 mt-28">
              <Icons.alertCircle className="w-24 h-24 text-gray-300 mb-4" />

              <p className="font-medium text-gray-300 text-xl text-center">
                Grocery not found
              </p>
            </div>
          ) : (
            <div className="relative text-gray-900 mt-28">
              <div className="space-y-4">
                {!!groceryData?.items?.length ? (
                  groceryData?.items?.map((item) => {
                    return (
                      <div key={item?.id}>
                        <Link
                          to={`${AppRoutes.Groceries}/${groceryId}${AppRoutes.GroceryItems}/${item?.id}`}
                        >
                          <GroceryItemCard
                            className="cursor-pointer"
                            groupData={groceryData}
                            data={item}
                          />
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex justify-center items-center flex-col mb-16 mt-28">
                    <Icons.alertCircle className="w-24 h-24 text-gray-300 mb-4" />

                    <p className="font-medium text-gray-300 text-xl text-center">
                      No items found
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </GroceryLayout>
    </>
  );
}
