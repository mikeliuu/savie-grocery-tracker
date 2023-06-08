import { User } from "@/lib/types/user";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios-base-query";

export enum UserUrl {
  Info = "/info",
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/users`,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserInfo: builder.query<User, {}>({
      query: () => ({
        url: UserUrl.Info,
      }),
      providesTags: ["User"],
    }),
    updateUserInfo: builder.mutation<User, Pick<User, "email" | "name">>({
      query: (payload: Pick<User, "email" | "name">) => ({
        method: "PUT",
        url: UserUrl.Info,
        body: payload,
        delay: true,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUserInfoQuery, useUpdateUserInfoMutation } = userApi;
