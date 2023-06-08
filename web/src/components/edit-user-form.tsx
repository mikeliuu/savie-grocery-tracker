import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { classMerge } from "@/lib/utils";
import { editUserSchema } from "@/lib/validations/edit-user";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
} from "@/redux/services/userApi";

interface EditUserFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type EditUserFormData = z.infer<typeof editUserSchema>;

export default function EditUserForm({
  className,
  ...props
}: EditUserFormProps) {
  const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserInfoQuery(
    {},
  );

  const [handleUpdateUser, { isLoading: isUpdateUserLoading }] =
    useUpdateUserInfoMutation();

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  const userProps = React.useMemo(
    () => ({
      name: userInfo?.name || "",
      email: userInfo?.email || "",
    }),
    [userInfo],
  );

  const isLoading = isUserInfoLoading || isUpdateUserLoading;

  const isDataUnchanged = userProps?.name === watch("name");

  const onSubmit: SubmitHandler<EditUserFormData> = async (data) => {
    await handleUpdateUser(data);
  };

  React.useEffect(() => {
    if (userProps) {
      setValue("name", userProps?.name);
      setValue("email", userProps?.email);
    }
  }, [userProps]);

  return (
    <div
      {...props}
      className={classMerge("w-full  md:mt-0 sm:max-w-md xl:p-0", className)}
    >
      <div className="space-y-4 md:space-y-6">
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Label htmlFor="name">Username</Label>

            <Input
              type="text"
              id="name"
              placeholder="Your name"
              disabled={isLoading}
              helperText={errors?.name?.message}
              error={!!errors?.name}
              {...register("name")}
            />
          </div>

          <div>
            <Label htmlFor="naemailme">Email Address</Label>

            <Input
              type="text"
              id="email"
              placeholder="name@company.com"
              disabled={isLoading}
              helperText={errors?.email?.message}
              error={!!errors?.email}
              {...register("email")}
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="default"
              className="w-1/3 mt-4"
              disabled={isLoading || isDataUnchanged}
              loading={isUpdateUserLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
