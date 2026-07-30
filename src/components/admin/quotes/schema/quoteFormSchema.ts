import { z } from "zod";

export const lineItemSchema = z.object({
  category: z.string().trim().min(1, "Category is required"),
  itemNumber: z.string().trim(),
  color: z.string().trim(),
  description: z.string().trim().min(1, "Description is required"),
  imprintType: z.string().trim(),
  sizes: z.record(z.string(), z.number()),
  items: z.number(),
  markup: z.number(),
  price: z.number(),
  taxed: z.boolean(),
});

export const groupSchema = z.object({
  name: z.string().trim().min(1, "Group name is required"),
  priceMatrixId: z.string().trim(),
  lineItems: z.array(lineItemSchema).min(1, "Add at least one line item"),
});

export const quoteFormSchema = z.object({
  customerId: z.string().trim().min(1, "Customer is required"),
  repId: z.string().trim().min(1, "Rep is required"),
  poNumber: z.string().trim(),
  deliveryMethod: z.string().trim(),
  dueDate: z.string().trim(),
  notes: z.string().trim(),
  discount: z.number(),
  taxRate: z.number(),
  groups: z.array(groupSchema).min(1, "Add at least one group"),
});

export type LineItemFormValues = z.infer<typeof lineItemSchema>;
export type GroupFormValues = z.infer<typeof groupSchema>;
export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const makeDefaultLineItem = (
  sizeKeys: string[],
): LineItemFormValues => ({
  category: "",
  itemNumber: "",
  color: "",
  description: "",
  imprintType: "",
  sizes: Object.fromEntries(sizeKeys.map((s) => [s, 0])),
  items: 0,
  markup: 0,
  price: 0,
  taxed: false,
});

export const makeDefaultGroup = (
  sizeKeys: string[],
  groupNumber: number,
): GroupFormValues => ({
  name: `Group ${groupNumber}`,
  priceMatrixId: "",
  lineItems: [makeDefaultLineItem(sizeKeys)],
});
