export const deliveryMethods = [
  { label: "Payment on Delivery", value: "payment-on-delivery" },
  { label: "Pickup", value: "pickup" },
  { label: "Courier", value: "courier" },
  { label: "Delivery", value: "delivery" },
  { label: "Dropship", value: "dropship" },
];

export const categoryOptions = [
  { label: "Apparel/Accessories", value: "apparel-accessories" },
  { label: "CNC/Laser", value: "cnc-laser" },
  { label: "Digital Printing", value: "digital-printing" },
  { label: "Fees", value: "fees" },
  { label: "Graphic Design", value: "graphic-design" },
  { label: "Installation", value: "installation" },
  { label: "Paper", value: "paper" },
  { label: "Promotional", value: "promotional" },
];

export interface TableColumnVisibility {
  category?: boolean;
  itemNumber?: boolean;
  color?: boolean;
  markup?: boolean;
  taxed?: boolean;
  mockup?: boolean;
}

export const defaultColumnVisibility: TableColumnVisibility = {
  category: true,
  itemNumber: true,
  color: true,
  markup: true,
  taxed: true,
  mockup: true,
};

export const STANDARD_SIZE_PRESETS: Record<string, string[]> = {
  Adult: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"],
  Youth: ["YXS", "YS", "YM", "YL", "YXL"],
  Toddler: ["2T", "3T", "4T", "5T", "6T"],
  Infant: ["Newborn", "3M", "6M", "9M", "12M", "18M", "24M"],
};

const SIZE_COL_WIDTH = "65px";

// Build headers dynamically: fixed columns + one per selected size
export const buildTableHeaders = (
  sizes: string[],
  visibility: TableColumnVisibility = defaultColumnVisibility,
) => {
  const before: string[] = [];
  if (visibility.category !== false) before.push("Category");
  if (visibility.itemNumber !== false) before.push("Item #");
  if (visibility.color !== false) before.push("Color");
  before.push("Description");

  const after: string[] = ["Items"];
  if (visibility.markup !== false) after.push("Markup %");
  after.push("Price");
  if (visibility.taxed !== false) after.push("Taxed");
  after.push("Total");
  if (visibility.mockup !== false) after.push("Mockup");
  after.push(""); // for Delete action column

  return [...before, ...sizes, ...after];
};

export const buildGridTemplateColumns = (
  sizes: string[],
  visibility: TableColumnVisibility = defaultColumnVisibility,
) => {
  const beforeCols: string[] = [];
  if (visibility.category !== false) beforeCols.push("120px");
  if (visibility.itemNumber !== false) beforeCols.push("50px");
  if (visibility.color !== false) beforeCols.push("65px");
  beforeCols.push("1fr");

  const sizeCols = sizes.map(() => SIZE_COL_WIDTH);

  const afterCols: string[] = ["65px"];
  if (visibility.markup !== false) afterCols.push("85px");
  afterCols.push("80px");
  if (visibility.taxed !== false) afterCols.push("40px");
  afterCols.push("50px");
  if (visibility.mockup !== false) afterCols.push("130px");
  afterCols.push("36px"); // Delete icon column

  return [...beforeCols, ...sizeCols, ...afterCols].join(" ");
};
