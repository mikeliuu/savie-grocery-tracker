import { Location } from "@/lib/types/location";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios-base-query";

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/locations`,
  }),
  tagTypes: ["Location"],
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], null>({
      query: () => ({ url: "" }),
      providesTags: ["Location"],
    }),
    createLocation: builder.mutation<Location, Pick<Location, "name">>({
      query: (payload) => ({
        url: "",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Location"],
    }),
    updateLocation: builder.mutation<
      Location,
      { id: Pick<Location, "id">; payload: Pick<Location, "name"> }
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
  useLazyGetLocationsQuery,
  useGetLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
} = locationApi;
