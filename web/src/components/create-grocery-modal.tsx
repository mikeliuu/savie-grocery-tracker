import React from "react";
import { classMerge } from "@/lib/utils";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import AppRoutes from "@/lib/routes";

interface CreateGroceryModalProps {
  className?: string;
  open: boolean;
  onClose: () => void;
}

export default function CreateGroceryModal({
  className,
  open = false,
  onClose,
}: CreateGroceryModalProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
  };

  const goToWriteGrocery = () => {
    navigate(AppRoutes.WriteGrocery);

    handleClose();
  };

  const goToImportReceipt = () => {
    navigate(AppRoutes.importReceiptGrocery);

    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      header="Create Grocery"
      containerClass={classMerge("p-4")}
      className={classMerge(className, "w-full rounded-2xl")}
    >
      <div className="flex flex-col items-center justify-scenter py-4 px-8 my-20 space-y-2">
        <div className="text-gray-900 font-semibold text-lg text-center mb-8">
          Write a grocery or import a receipt to add your groceries here
        </div>

        <Button variant="info" onClick={goToWriteGrocery}>
          Create By Text
        </Button>

        <div className="flex flex-shrink-0 px-6 text-gray-500 text-lg font-medium">
          or
        </div>

        <Button variant="info" onClick={goToImportReceipt}>
          Import Receipt
        </Button>
      </div>
    </Modal>
  );
}
