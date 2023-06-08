import React from "react";
import { Link } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icon";
import { classMerge } from "@/lib/utils";
import BaseLayout from "@/layouts/base-layout";
import RegisterForm from "@/components/register-form";

export default function Register() {
  return (
    <BaseLayout>
      <div className="flex flex-col items-center justify-center container px-6 py-8 mx-auto">
        {/* <Link
          to="/"
          className={classMerge(
            buttonVariants({ variant: "link" }),
            "flex flex-row items-center absolute left-4 top-4 md:left-8 md:top-8 bg-transparent",
          )}
        >
          <>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back
          </>
        </Link> */}

        <div className="flex items-center mb-6">
          <div className="mr-2 w-6 h-6 rounded-full bg-primary-600" />

          <p className="font-semibold text-gray-700  text-2xl">Savie</p>
        </div>

        <RegisterForm />
      </div>
    </BaseLayout>
  );
}
