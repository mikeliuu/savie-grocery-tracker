import * as z from "zod";

export const grocerySchema = z
  .object({
    name: z.string().min(1, { message: "Please fill in grocery name" }),
    quantity: z.string().min(1, { message: "Please fill in quantity" }),
    price: z
      .string()
      .regex(/^\s*\d*\.?\d*\s*$/, "Price is invalid")
      .default("0"),
    barcode: z.string().default(""),
    vendor: z.string().default(""),
    expiryDate: z.string().or(z.date()).nullable(),
    category: z.object({
      name: z.string(),
      value: z.string(),
    }),
    location: z.object({
      name: z.string(),
      value: z.string(),
    }),
  })
  .partial()
  .required({
    name: true,
    quantity: true,
  });
