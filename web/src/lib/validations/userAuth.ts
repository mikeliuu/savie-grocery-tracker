import * as z from "zod";

const PASSWORD_REQUIRED_LENGTH = 8;

export const userAuthSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
  password: z.string().min(1, { message: "Password is required" }),
});

export const loginSchema = userAuthSchema.required();

export const registerSchema = userAuthSchema
  .extend({
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .required()
  .refine((schema) => schema.password.length >= PASSWORD_REQUIRED_LENGTH, {
    message: `Password must be at least ${PASSWORD_REQUIRED_LENGTH} characters long`,
    path: ["password"],
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });
