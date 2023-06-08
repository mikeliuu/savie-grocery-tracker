export type TotalWasteCost = {
  totalCost: number;
  totalItems: number;
};

export type GroceryWasteCost = {
  thisWeek: TotalWasteCost;
  lastWeek: TotalWasteCost;
  averageOfAllAccounts: TotalWasteCost;
};

export type GroceryItem = {
  id?: number;
  groceryId?: number;
  quantity?: number;
  name?: string;
  expiryDate: string | Date | null;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  deletedAt: string | Date | null;
  locationId?: number;
  locationName: string | null;
  done: boolean;
  vendor: string | null;
  price: number;
  barcode: string;
  categoryId: number;
  categoryName: string | null;
};

export type Grocery = {
  id: number;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  deletedAt: string | Date | null;
  name: string;
  categoryId: number;
  categoryName: string | null;
  items: GroceryItem[];
};

export type GroceryWasteSummary = {
  totalCostOfThisWeek: number;
  totalCostOfLastWeek: number;
  totalItemsOfThisWeek: number;
  totalItemsOfLastWeek: number;
  averageAccountCostOfThisWeek: number;
  averageAccountCostOfLastWeek: number;
  totalAccountItemsOfThisWeek: number;
  totalAccountItemsOfLastWeek: number;
};

export type CreateGrocery = Pick<Grocery, "categoryId" | "name"> &
  Pick<
    GroceryItem,
    "price" | "vendor" | "expiryDate" | "locationId" | "barcode"
  > & {
    quantity: number;
  };

export type UpdateGrocery = Omit<
  CreateGrocery,
  "locationId" | "price" | "vendor" | "expiryDate"
> & {
  id: number;
};

export type CreateReceiptGroceries = {
  items: CreateGrocery[];
};

export type CreateGroceryItem = Partial<
  Omit<
    GroceryItem,
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "locationName"
    | "categoryId"
    | "categoryName"
  >
>;

export type UpdateGroceryItem = Omit<CreateGroceryItem, "groceryId">;

export type GroceryFilterOption = {
  filter: "category" | "location";
  value: {
    id: number;
    name: string;
  }[];
};

export type GroceryFilterParams = {
  search: string;
  sort: string;
  filters: {
    locations: number[];
    categories: number[];
    isExpired: boolean;
  };
};

export type GroceryReceiptPayment = {
  cardNumber: string;
  displayName: string;
  terms: number;
  type: string;
};

export type GroceryReceiptVendor = {
  name: string;
  rawName: string;
  address: string;
  storeNumber: string;
};

export type GroceryReceiptItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  type: "food" | "product" | "discount" | string;
};

export type GroceryReceipt = {
  id: number;
  type: "receipt" | "string";
  currency: string;
  total: number;
  vendor: GroceryReceiptVendor;
  payment: GroceryReceiptPayment;
  items: GroceryReceiptItem[];
};
