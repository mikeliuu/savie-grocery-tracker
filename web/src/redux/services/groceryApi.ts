import {
  CreateGrocery,
  Grocery,
  GroceryFilterOption,
  GroceryFilterParams,
  GroceryItem,
  CreateReceiptGroceries,
  CreateGroceryItem,
  GroceryReceipt,
  UpdateGrocery,
  GroceryWasteSummary,
  UpdateGroceryItem,
} from "@/lib/types/grocery";
import { SinceParam } from "@/lib/types/page";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios-base-query";

export enum GroceryUrl {
  List = "/list",
  ListFilterOptions = "/list/filter-options",
  Expiry = "/expiry",
  Expiring = "/expiring",
  Recent = "/recent",
  Search = "/search",
  AllNames = "/names",
  PriceHistory = "/price-history",
  WasteCost = "/waste-cost",
  BulkCreate = "/bulk",
  GroceryItems = "/grocery-items",
}

export const groceryApi = createApi({
  reducerPath: "groceryApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/groceries`,
  }),
  tagTypes: ["GroceryList", "RecentGroceries", "GroceryDetail"],
  endpoints: (builder) => ({
    getGrocery: builder.query<Grocery, { groceryId: number }>({
      query: ({ groceryId }) => ({
        url: `/${groceryId}`,
      }),
      providesTags: ["GroceryDetail"],
    }),
    getWasteCost: builder.query<GroceryWasteSummary, { since: SinceParam }>({
      query: ({ since }) => ({
        url: `${GroceryUrl.WasteCost}?since=${since}`,
      }),
    }),
    getExpiredGroceries: builder.query<Grocery[], null>({
      query: () => ({
        url: GroceryUrl.Expiry,
      }),
    }),
    getExpiringGroceries: builder.query<Grocery[], null>({
      query: () => ({
        url: GroceryUrl.Expiring,
      }),
    }),
    getRecentGroceries: builder.query<Grocery[], { since: SinceParam }>({
      query: ({ since }) => ({
        url: `${GroceryUrl.Recent}?since=${since}`,
      }),
      providesTags: ["RecentGroceries"],
    }),
    getGroceryNames: builder.query<string[], null>({
      query: () => ({
        url: GroceryUrl.AllNames,
      }),
    }),
    getSearchGroceries: builder.query<Grocery[], string>({
      query: (query = "") => ({
        url: GroceryUrl.Search,
        params: !!query ? { q: query } : {},
      }),
    }),
    getGroceryListFilterOptions: builder.query<GroceryFilterOption[], null>({
      query: () => ({ url: GroceryUrl.ListFilterOptions }),
    }),
    getGroceryList: builder.mutation<Grocery[], GroceryFilterParams | {}>({
      query: (payload) => ({
        url: GroceryUrl.List,
        method: "POST",
        body: payload,
      }),
    }),
    getGroceryItem: builder.query<
      GroceryItem,
      {
        groceryId: number | string;
        groceryItemId: number | string;
      }
    >({
      query: ({ groceryId, groceryItemId }) => ({
        url: `/${groceryId}${GroceryUrl.GroceryItems}/${groceryItemId}`,
      }),
    }),
    createGrocery: builder.mutation<Grocery, CreateGrocery>({
      query: (payload) => ({
        url: "",
        method: "POST",
        body: payload,
        delay: true,
      }),
      invalidatesTags: ["GroceryList", "RecentGroceries"],
    }),
    bulkCreateGrocery: builder.mutation<Grocery[], CreateReceiptGroceries>({
      query: (payload) => ({
        url: GroceryUrl.BulkCreate,
        method: "POST",
        body: payload,
      }),
    }),
    uploadGroceryReceipt: builder.mutation<GroceryReceipt, FormData>({
      query: (payload) => ({
        url: "/upload-receipt",
        method: "POST",
        body: payload,
        headers: {
          "content-type": "multipart/form-data",
        },
      }),
    }),
    createGroceryItem: builder.mutation<
      void,
      {
        groceryId: number | string;
        payload: CreateGroceryItem;
      }
    >({
      query: (payload) => ({
        url: `/${payload?.groceryId}${GroceryUrl.GroceryItems}`,
        method: "POST",
        body: payload?.payload,
      }),
    }),
    updateGroceryItem: builder.mutation<
      void,
      {
        groceryId: number | string;
        groceryItemId: number | string;
        payload: UpdateGroceryItem;
      }
    >({
      query: (payload) => ({
        url: `/${payload?.groceryId}${GroceryUrl.GroceryItems}/${payload?.groceryItemId}`,
        method: "PUT",
        body: payload?.payload,
      }),
    }),
    updateGrocery: builder.mutation<
      Grocery,
      {
        groceryId: number | string;
        payload: UpdateGrocery;
      }
    >({
      query: (payload) => ({
        url: `/${payload?.groceryId}`,
        method: "PUT",
        body: payload?.payload,
      }),
      invalidatesTags: ["GroceryDetail"],
    }),
    resotreGroceryItem: builder.mutation<
      void,
      {
        groceryId: number | string;
        groceryItemId: number | string;
      }
    >({
      query: (payload) => ({
        url: `/${payload?.groceryId}${GroceryUrl.GroceryItems}/${payload?.groceryItemId}/restore`,
        method: "PUT",
      }),
    }),
    deleteGroceryItem: builder.mutation<
      void,
      {
        groceryId: number | string;
        groceryItemId: number | string;
      }
    >({
      query: (payload) => ({
        url: `/${payload?.groceryId}${GroceryUrl.GroceryItems}/${payload?.groceryItemId}`,
        method: "DELETE",
      }),
    }),
    resotreGrocery: builder.mutation<
      void,
      {
        groceryId: number | string;
      }
    >({
      query: (payload) => ({
        url: `/${payload?.groceryId}/restore`,
        method: "PUT",
      }),
      invalidatesTags: ["GroceryDetail"],
    }),
    deleteGrocery: builder.mutation<
      void,
      {
        groceryId: number | string;
      }
    >({
      query: (payload) => ({
        url: `/${payload?.groceryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GroceryDetail"],
    }),
  }),
});

export const {
  useGetGroceryQuery,
  useGetWasteCostQuery,
  useGetSearchGroceriesQuery,
  useGetRecentGroceriesQuery,
  useGetGroceryNamesQuery,
  useGetExpiredGroceriesQuery,
  useGetExpiringGroceriesQuery,
  useGetGroceryItemQuery,
  useGetGroceryListFilterOptionsQuery,
  useGetGroceryListMutation,
  useBulkCreateGroceryMutation,
  useCreateGroceryItemMutation,
  useCreateGroceryMutation,
  useDeleteGroceryItemMutation,
  useUpdateGroceryItemMutation,
  useUpdateGroceryMutation,
  useUploadGroceryReceiptMutation,
  useResotreGroceryItemMutation,
  useDeleteGroceryMutation,
  useResotreGroceryMutation,
} = groceryApi;
