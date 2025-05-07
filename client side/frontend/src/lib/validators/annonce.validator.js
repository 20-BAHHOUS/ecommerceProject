import * as z from "zod";

export const CreateAnnonceValidator = z.object({
  createdBy: z.string().optional(),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string(),
  price: z.number().min(1, { message: "Price must be a positive number" }),
  images: z.any(),
  category: z.string().min(1, { message: "Category is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  location: z.string(),
  conditon: z.string(),
});
