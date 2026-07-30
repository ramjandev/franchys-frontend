import { z } from "zod";

export const customerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    phone: z.string().min(1, "Phone number is required"),
    customerType: z.enum(["BUSINESS", "PERSONAL"]),
    language: z.string().min(1, "Language preference is required"),
    website: z
      .string()
      .optional()
      .refine((val) => !val || /^https?:\/\/.+/.test(val), {
        message: "Enter a valid URL",
      }),
    companyName: z.string().optional(),
    taxId: z.string().optional(),

    secondaryFirstName: z.string().optional(),
    secondaryLastName: z.string().optional(),
    secondaryEmail: z
      .string()
      .optional()
      .refine((val) => !val || z.string().email().safeParse(val).success, {
        message: "Enter a valid email address",
      }),
    secondaryPhone: z.string().optional(),

    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),

    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),

    orderPurpose: z.string().optional(),
    eventType: z.string().optional(),
    eventDate: z.string().optional(),
    profileImage: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.customerType === "BUSINESS" && !data.companyName?.trim()) {
      ctx.addIssue({
        path: ["companyName"],
        code: z.ZodIssueCode.custom,
        message: "Company name is required",
      });
    }
    if (data.customerType === "PERSONAL" && !data.orderPurpose?.trim()) {
      ctx.addIssue({
        path: ["orderPurpose"],
        code: z.ZodIssueCode.custom,
        message: "Order purpose is required",
      });
    }
  });

export type CustomerFormValues = z.infer<typeof customerSchema>;
