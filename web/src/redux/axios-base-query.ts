import { STORAGE_TOKEN_KEY } from "@/lib/constants";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosResponse } from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";

const sleep: any = (ms: number, x: any) => {
  return new Promise((resolve) => setTimeout(() => resolve(x), ms));
};

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url?: string;
      method?: AxiosRequestConfig["method"] | "GET";
      body?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      delay?: boolean;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, body, params, delay = false }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data: body,
        params,
        headers: {
          Authorization: window.localStorage.getItem(STORAGE_TOKEN_KEY),
        },
      });

      return delay ? sleep(500, result.data) : result.data;
    } catch (axiosError) {
      let err = axiosError as AxiosError;

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
