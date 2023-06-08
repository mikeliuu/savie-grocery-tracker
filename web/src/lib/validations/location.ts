import * as z from "zod";

export const createLocationSchema = z
  .object({
    name: z.string().min(1, { message: "Location name is required" }),
  })
  .required();
