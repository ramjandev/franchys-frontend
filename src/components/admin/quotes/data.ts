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

// Fixed (non-size) columns — everything before and after the dynamic size columns
const FIXED_HEADERS_BEFORE_SIZES = [
  "Category",
  "Item #",
  "Color",
  "Description",
  "Imprint",
];
const FIXED_HEADERS_AFTER_SIZES = [
  "Items",
  "Markup %",
  "Price",
  "Taxed",
  "Total",
  "Mockup",
];

const FIXED_COLS_BEFORE_SIZES = "120px 50px 65px 1fr 120px";
const FIXED_COLS_AFTER_SIZES = "65px 85px 80px 40px 50px 120px";
const SIZE_COL_WIDTH = "65px";

// Build headers dynamically: fixed columns + one per selected size
export const buildTableHeaders = (sizes: string[]) => [
  ...FIXED_HEADERS_BEFORE_SIZES,
  ...sizes,
  ...FIXED_HEADERS_AFTER_SIZES,
];

export const buildGridTemplateColumns = (sizes: string[]) => {
  const sizeCols = sizes.map(() => SIZE_COL_WIDTH).join(" ");
  return `${FIXED_COLS_BEFORE_SIZES} ${sizeCols} ${FIXED_COLS_AFTER_SIZES}`;
};
