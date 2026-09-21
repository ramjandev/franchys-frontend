import { z } from "zod";

export const customerSchema = z.object({
  // Required
  firstName: z.string().min(1, "First name is required"),

  lastName: z.string().min(1, "Last name is required"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  phone: z.string().min(1, "Phone number is required"),

  customerType: z.enum(["BUSINESS", "PERSONAL"], {
    error: "Customer type is required",
  }),

  // Optional
  language: z.string().optional(),

  website: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "Enter a valid URL",
    }),

  companyName: z.string().optional(),
  taxId: z.string().optional(),
  isTaxExempt: z.boolean().optional(),
  taxExemptNumber: z.string().optional(),

  secondaryFirstName: z.string().optional(),
  secondaryLastName: z.string().optional(),

  secondaryEmail: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Enter a valid email address",
    }),

  secondaryPhone: z.string().optional(),

  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),

  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),

  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  profileImage: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
