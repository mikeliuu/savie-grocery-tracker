import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useGetGroceryListMutation } from "@/redux/services/groceryApi";
import { Grocery, GroceryFilterParams } from "@/lib/types/grocery";
import AppRoutes from "@/lib/routes";
import { Link, useNavigate } from "react-router-dom";
import GroceryLayout from "@/layouts/grocery-layout";
import GroceryCard from "@/components/grocery-card";
import { classMerge } from "@/lib/utils";
import { Icons } from "@/components/ui/icon";
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group";
import { Modal } from "@/components/ui/modal";
import SearchBar from "@/components/ui/search-bar";
import useToggle from "@/lib/hooks/useToggle";
import { SelectSortModal } from "@/components/select-sort-modal";
import { RadioGroupsProps } from "@/components/ui/radio-groups";
import { DEFAULT_SORT_OPTION } from "@/lib/constants";

export default function GroceryList() {
  const navigate = useNavigate();

  const [groceries, setGroceries] = useState<Grocery[]>([]);

  const [sort, setSort] = useState<RadioGroupsProps["value"] | undefined>(
    DEFAULT_SORT_OPTION,
  );
  const [search, setSearch] = useState("");

  const {
    open: openSortPopup,
    toggleOpen: toggleOpenSortPopup,
    toggleClose: toggleCloseSortPopup,
  } = useToggle();

  const [getGroceryList, { isLoading: isGroceryListLoading }] =
    useGetGroceryListMutation();

  const goToWriteGrocery = () => {
    navigate(AppRoutes.WriteGrocery);
  };

  const goToImportReceipt = () => {
    navigate(AppRoutes.importReceiptGrocery);
  };

  const handleFetchGroceryList = async (
    payload: Partial<GroceryFilterParams>,
  ) => {
    await getGroceryList(payload)
      .unwrap()
      .then((res) => {
        setGroceries(res);
      });
  };

  useEffect(() => {
    handleFetchGroceryList({
      sort: sort?.value,
      search,
    });
  }, [sort, search]);

  const groceryListHeader = (
    <SearchBar onSearch={(value: string) => setSearch(value)} />
  );

  const groceryButtonActions: ButtonGroupItem[] = [
    {
      label: (
        <>
          <Icons.pen className="mr-2 w-4 h-4" />
          <p>Write</p>
        </>
      ),
      onClick: goToWriteGrocery,
    },
    // {
    //   label: (
    //     <>
    //       <Icons.uploadFile className="mr-2 w-4 h-4" />
    //       <p>Receipt</p>
    //     </>
    //   ),
    //   onClick: goToImportReceipt,
    // },
    {
      label: (
        <>
          <Icons.sort className="mr-2 w-4 h-4" />
          <p>Sort</p>
        </>
      ),
      onClick: toggleOpenSortPopup,
    },
  ];

  return (
    <>
      <SelectSortModal
        open={openSortPopup}
        onClose={toggleCloseSortPopup}
        onChange={(selected) => {
          setSort(selected!);
        }}
        value={sort!}
      />

      <GroceryLayout
        header={groceryListHeader}
        footer={
          <ButtonGroup
            buttonClass="md:px-6 md:py-3 transition-all"
            group={groceryButtonActions}
          />
        }
      >
        <div className="px-8 grid grid-cols-1 gap-4 mt-24 mb-40 md:mb-0">
          {isGroceryListLoading
            ? new Array(3)
                .fill(null)
                ?.map((_, index) => (
                  <GroceryCard key={index} loading={isGroceryListLoading} />
                ))
            : groceries?.map((grocery) => {
                return (
                  <Link
                    className={classMerge({
                      "pointer-events-none": isGroceryListLoading,
                    })}
                    key={grocery?.id}
                    to={`${AppRoutes.Groceries}/${grocery?.id}`}
                  >
                    <GroceryCard
                      loading={isGroceryListLoading}
                      data={grocery}
                    />
                  </Link>
                );
              })}
        </div>
      </GroceryLayout>
    </>
  );
}
