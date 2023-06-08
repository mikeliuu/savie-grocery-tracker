import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { classMerge } from "@/lib/utils";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useGetUserInfoQuery, userApi } from "@/redux/services/userApi";
import { editAccountSchema } from "@/lib/validations/account";
import {
  accountApi,
  useUpdateAccountMutation,
} from "@/redux/services/accountApi";
import { useDispatch } from "react-redux";
import { useInvalidateTags } from "@/lib/hooks/useInvalidateTags";

interface EditAccountFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type EditAccountFormData = z.infer<typeof editAccountSchema>;

export default function EditAccountForm({
  className,
  ...props
}: EditAccountFormProps) {
  const { invalidateTags } = useInvalidateTags();

  const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserInfoQuery(
    {},
  );

  const [handleUpdateAccount, { isLoading: isUpdateAccountLoading }] =
    useUpdateAccountMutation();

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditAccountFormData>({
    resolver: zodResolver(editAccountSchema),
  });

  const userProps = React.useMemo(
    () => ({
      name: userInfo?.defaultAccount?.name || "",
    }),
    [userInfo],
  );

  const isLoading = isUserInfoLoading || isUpdateAccountLoading;

  const isDataUnchanged = userProps?.name === watch("name");

  const onSubmit: SubmitHandler<EditAccountFormData> = async (data) => {
    await handleUpdateAccount({
      accountId: userInfo?.defaultAccount?.id!,
      payload: data,
    }).then((res) => {
      if (Object.keys(res)?.includes("error")) return;

      invalidateTags(userApi.reducerPath, ["User"]);
    });
  };

  React.useEffect(() => {
    if (userProps) {
      setValue("name", userProps?.name);
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
            <Label htmlFor="name">Account Name</Label>

            <Input
              type="text"
              id="name"
              placeholder="Your account name"
              disabled={isLoading}
              helperText={errors?.name?.message}
              error={!!errors?.name}
              {...register("name")}
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="default"
              className="w-1/3 mt-4"
              disabled={isLoading || isDataUnchanged}
              loading={isUpdateAccountLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
