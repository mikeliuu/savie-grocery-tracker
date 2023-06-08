import * as z from "zod";

export const editAccountSchema = z.object({
  name: z.string().min(1, { message: "Account name is required" }),
});
