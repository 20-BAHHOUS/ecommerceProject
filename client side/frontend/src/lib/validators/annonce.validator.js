import * as z from "zod";

// Create a base schema with common fields
const baseSchema = {
  createdBy: z.string().optional(),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Type is required" }),
  images: z.any(),
};

// Create a wanted type schema
const wantedSchema = z.object({
  ...baseSchema,
  type: z.literal("wanted"),
  // These fields are optional for wanted type
  price: z.number().optional().nullable(),
  category: z.string().optional().nullable(),
  subcategory: z.string().optional().nullable(),
  condition: z.string().optional().nullable(),
});

// Create a non-wanted type schema
const otherTypesSchema = z.object({
  ...baseSchema,
  type: z.enum(["sale", "trade", "rent"]),
  // These fields are required for non-wanted types
  price: z.number().min(1, { message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().min(1, { message: "Subcategory is required" }),
  condition: z.string().min(1, { message: "Condition is required" }),
});

// Combine the schemas with a discriminated union based on 'type'
export const CreateAnnonceValidator = z.discriminatedUnion("type", [
  wantedSchema,
  otherTypesSchema,
]);
