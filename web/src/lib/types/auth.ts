export type UserAuth = {
  email: string;
  password: string;
};

export enum AuthType {
  Register = "register",
  Login = "login",
}
