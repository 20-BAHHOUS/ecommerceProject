import * as z from "zod";

export const SignupValidator = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email format" }).min(1, { message: "Email is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: "Phone must contain only digits" })
    .min(10, { message: "Phone number must be exactly 10 digits" })
    .max(10, { message: "Phone number must be exactly 10 digits" }),
}); 

export const LoginValidator = z.object({
  email: z.string().email( { message: "Invalid email format"}).min(1, {message: "Email is required"}),
  password: z.string().min(8,{message: "Password must be at least 8 characters"}),
});
