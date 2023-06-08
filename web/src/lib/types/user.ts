import { Account } from "./account";

export type Role = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  defaultAccount: Account;
  role: Role;
};
