import { AuthType, UserAuth } from "@/lib/types/auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios-base-query";

export enum AuthUrl {
  AuthType = "/auth-type",
  Login = "/login",
  Register = "/register",
  Google = "/google",
  VerifyEmail = "/verify-email",
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/auth`,
  }),
  endpoints: (builder) => ({
    getAuthType: builder.mutation<AuthType, Pick<UserAuth, "email">>({
      query: (payload: Pick<UserAuth, "email">) => ({
        url: AuthUrl.AuthType,
        method: "POST",
        body: payload,
      }),
    }),
    login: builder.mutation<{ accessToken: string }, UserAuth>({
      query: (payload: UserAuth) => ({
        url: AuthUrl.Login,
        method: "POST",
        body: payload,
      }),
    }),
    register: builder.mutation({
      query: (payload: UserAuth) => ({
        url: AuthUrl.Register,
        method: "POST",
        body: payload,
      }),
    }),
    googleAuth: builder.mutation<{ accessToken: string }, { code: string }>({
      query: (payload) => ({
        url: AuthUrl.Google,
        method: "POST",
        body: payload,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (emailToken: string) => ({
        url: AuthUrl.VerifyEmail,
        method: "PUT",
        body: { emailToken },
        headers: {
          Authorization: `Bearer ${emailToken}`,
        },
      }),
    }),
    reverifyEmail: builder.mutation({
      query: (payload: Pick<UserAuth, "email">) => ({
        url: AuthUrl.VerifyEmail,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetAuthTypeMutation,
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useVerifyEmailMutation,
  useReverifyEmailMutation,
} = authApi;
