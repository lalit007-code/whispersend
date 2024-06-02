import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 charcters")
  .max(20, "Username must be no more than 20 charcters ")
  .regex(/^[a-zA-z0-9]+$/, "Username must be contain special charcters");

export const signUpSchena = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});
