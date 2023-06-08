import * as z from "zod";

export const createCategorySchema = z
  .object({
    name: z.string().min(1, { message: "Cateogry name is required" }),
  })
  .required();
