import React from "react";
import BackActionMenuLayout from "@/layouts/back-action-menu-layout";
import EditUserForm from "@/components/edit-user-form";

export default function EditProfile() {
  return (
    <BackActionMenuLayout heading="Edit Profile">
      <div className="px-0 p-6 sm:p-8">
        <h1 className="mb-8 text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl ">
          Edit Profile
        </h1>

        <EditUserForm />
      </div>
    </BackActionMenuLayout>
  );
}
