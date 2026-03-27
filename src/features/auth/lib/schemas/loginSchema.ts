import { z } from "zod"
export const loginSchema = z.object({
  email: z.string().email({ message: "Incorrect email address" }),
  password: z.string().min(3, { message: "Password must be at least 3 characters long" }),
  rememberMe: z.boolean().optional(),
  captcha: z.string().optional(),
});
export type LoginInputs = z.infer<typeof loginSchema>;