import { Account } from "@/lib/types/account";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios-base-query";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/accounts`,
  }),
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], null>({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
    updateAccount: builder.mutation<
      Account,
      {
        accountId: number;
        payload: Pick<Account, "name">;
      }
    >({
      query: (payload) => ({
        url: `/${payload?.accountId}`,
        method: "PUT",
        body: payload?.payload,
        delay: true,
      }),
    }),
  }),
});

export const { useGetAccountsQuery, useUpdateAccountMutation } = accountApi;
