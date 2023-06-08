import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { classMerge } from "@/lib/utils";
import { registerSchema } from "@/lib/validations/userAuth";

import {
  useGetAuthTypeMutation,
  useGoogleAuthMutation,
  useLoginMutation,
  useRegisterMutation,
} from "@/redux/services/authApi";
import GoogleAuthButton from "./google-auth-button";
import { useAuthToken, useGoogleAuth } from "@/lib/hooks/auth";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import AppRoutes from "@/lib/routes";

interface RegiserFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm({
  className,
  ...props
}: RegiserFormProps) {
  const { login } = useAuthToken();

  const { handleGoogleLogin, isLoading: isGoogleAuthLoading } = useGoogleAuth();

  const [handleLogin, { isLoading: isLoginLoading }] = useLoginMutation();

  const [handleRegister, { isLoading: isRegisterLoading }] =
    useRegisterMutation();

  const [getAuthType, { isLoading: isAuthTypeLoading }] =
    useGetAuthTypeMutation();

  const isLoading =
    isLoginLoading ||
    isGoogleAuthLoading ||
    isAuthTypeLoading ||
    isRegisterLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleLocalRegister = async (data: RegisterFormData) => {
    await handleRegister(data);

    const res = await handleLogin(data).unwrap();

    login(res?.accessToken);
  };

  console.log({ errors });
  

  return (
    <div
      {...props}
      className={classMerge(
        "w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0",
        className,
      )}
    >
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <div>
          <h1 className="mb-8 text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl text-center">
            Sign up to save your food and products.
          </h1>
        </div>

        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(handleLocalRegister)}
        >
          <GoogleAuthButton onClick={handleGoogleLogin} disabled={isLoading} />

          <div className="flex items-center">
            <div className="w-full h-0.5 bg-gray-200"></div>
            <div className="flex flex-shrink-0 px-6 text-gray-500 text-lg font-medium">
              or
            </div>
            <div className="w-full h-0.5 bg-gray-200"></div>
          </div>

          <div>
            <Label htmlFor="email">Your email</Label>

            <Input
              type="email"
              id="email"
              placeholder="name@company.com"
              disabled={isLoading}
              helperText={errors?.email?.message}
              error={!!errors?.email}
              {...register("email")}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>

            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              disabled={isLoading}
              helperText={errors?.password?.message}
              error={!!errors?.password}
              {...register("password")}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>

            <Input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              disabled={isLoading}
              helperText={errors?.confirmPassword?.message}
              error={!!errors?.confirmPassword}
              {...register("confirmPassword")}
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="default"
              className="mt-4 w-full"
              disabled={isLoading}
              loading={isLoginLoading}
            >
              Sign up
            </Button>
          </div>

          <div>
            <p className="text-sm font-normal text-gray-900">
              Have an account?{" "}
              <Link
                to={AppRoutes.Home}
                className="font-semibold text-sm text-primary-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
