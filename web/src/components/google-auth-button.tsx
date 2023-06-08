import * as React from "react";

import { Button } from "./ui/button";
import { ButtonProps } from "./ui/button";
import { classMerge } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export default function GoogleAuthButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      type="button"
      {...props}
      className={classMerge(
        buttonVariants({ variant: "outline" }),
        "w-full",
        className,
      )}
    >
      <img
        className="mr-2"
        src="/google-icon.svg"
        alt="Google Logo"
        width={20}
        height={20}
      />
      Continue with Google
    </Button>
  );
}
