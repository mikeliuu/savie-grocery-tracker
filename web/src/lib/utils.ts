import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateFormat } from "./constants";
import AppRoutes from "./routes";
import { Grocery, GroceryItem } from "./types/grocery";

dayjs.extend(relativeTime);

export function classMerge(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDateExpired = (
  date: string | Date | null | undefined,
): boolean => {
  if (!date) return false;

  return dayjs(date) <= dayjs();
};

export const formatDate = (
  value: string | Date | null,
  format = DateFormat.DATE_FORMAT_WITH_MONTH,
): string => {
  if (!value) return "";

  return dayjs(value).format(format);
};

export const dateFromNow = (value: string | Date | null): string => {
  if (!value) return "";

  return dayjs(value).fromNow();
};

export const isNavActive = (route: AppRoutes) =>
  (window.location.pathname === "/" && route === "/") ||
  (window.location.pathname?.includes(route) && route !== "/");

export const getGroceryInfoMessage = (data: Grocery) => {
  if (!data) return "You do not have stock";

  const hasExpiredItem = data?.items?.some(
    (item) => item?.expiryDate && isDateExpired(item?.expiryDate),
  );

  const isOnlyItem = data?.items?.length === 1;

  const onlyItem = data?.items[0];

  const infoMessage = isOnlyItem
    ? !onlyItem?.expiryDate
      ? "No expiry date"
      : `${hasExpiredItem ? "Expired" : "Expires"} ${dateFromNow(
          onlyItem?.expiryDate,
        )}`
    : !data?.items?.length
    ? "You do not have stock"
    : `You have ${data?.items?.length} in stock`;

  return infoMessage;
};

export const getGroceryItemInfoMessage = (data: GroceryItem) => {
  if (!data?.expiryDate) return "No expiry date";

  const isExpired = isDateExpired(data?.expiryDate);

  return `${isExpired ? "Expired" : "Expires"} ${dateFromNow(
    data?.expiryDate,
  )}`;
};

export const hasExpiredGroceryItem = (data: Grocery) =>
  data?.items?.some(
    (item) => item?.expiryDate && isDateExpired(item?.expiryDate),
  ) || false;
