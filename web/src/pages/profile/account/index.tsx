import React from "react";
import BackActionMenuLayout from "@/layouts/back-action-menu-layout";
import EditAccountForm from "@/components/edit-account-form";

export default function Account() {
  return (
    <BackActionMenuLayout heading="Account">
      <div className="px-0 p-6 sm:p-8">
        <h1 className="mb-8 text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl ">
          Account
        </h1>

        <EditAccountForm />
      </div>
    </BackActionMenuLayout>
  );
}
