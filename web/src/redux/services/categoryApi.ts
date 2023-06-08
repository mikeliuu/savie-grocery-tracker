import { Category } from "@/lib/types/category";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios-base-query";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/categories`,
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], null>({
      query: () => ({
        url: "",
      }),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<Category, Pick<Category, "name">>({
      query: (payload) => ({
        url: "",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: Pick<Category, "id">; payload: Pick<Category, "name"> }
    >({
      query: (payload) => ({
        url: `${payload?.id}`,
        method: "PUT",
        body: payload?.payload,
      }),
    }),
  }),
});

export const {
  useLazyGetCategoriesQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;
