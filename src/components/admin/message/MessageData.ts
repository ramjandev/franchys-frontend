export type Tab = "Email" | "WhatsApp";
export type View =
  | "messages"
  | "allCampaigns"
  | "campaignDetail"
  | "newCampaign"
  | "editCampaign";
export type CampaignType = "Newsletter" | "Promotion" | "Discount";
export type CampaignStatus = "sent" | "draft";

export interface Message {
  id: number;
  subject: string;
  from: string;
  preview: string;
  date: string;
  unread?: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  emoji: string;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  type: CampaignType;
  subject: string;
  content: string;
  status: CampaignStatus;
  recipients: number | null;
  created: string;
  products: Product[];
  audience: string;
}

export interface NewsletterVals {
  subject: string;
  content: string;
}

export interface PromotionVals {
  promoCode: string;
  discountType: string;
  percentage: string;
  minOrder: string;
  startDate: string;
  endDate: string;
  terms: string;
}

export interface DiscountVals {
  discountCode: string;
  discountType: string;
  percentage: string;
  appliesTo: string;
  minOrder: string;
  expiry: string;
  usageLimit: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MESSAGES: Message[] = [
  {
    id: 1,
    subject:
      "Quote #1008: Artwork and Department of Elementary & Secondary Education",
    from: "Maria Laura Marte",
    preview:
      "Hi Rebecca, I wanted to follow up on the artwork approval for your recent order. We've prepared the mockups based on your specifications...",
    date: "Oct 23, 11:46am",
    unread: 2,
  },
  {
    id: 2,
    subject: "Quote sent: Production Reminder",
    from: "System",
    preview:
      "This is an automated reminder that your quote #1008 has been sent to the customer. Please follow up if you haven't received a response.",
    date: "Oct 22, 3:15pm",
  },
  {
    id: 3,
    subject: "Quote Updated",
    from: "Rebecca DeCesaris",
    preview:
      "I reviewed the quote and would like to make a few changes to the quantities. Can we adjust the order from 40 to 50 units?",
    date: "Oct 21, 9:38am",
    unread: 1,
  },
  {
    id: 4,
    subject: "Re: Invoice #1006",
    from: "Mike's Cool Shirts",
    preview:
      "Payment has been processed for invoice #1006. The total amount of $1,489.00 has been received. Thank you for your business.",
    date: "Oct 20, 2:22pm",
  },
  {
    id: 5,
    subject: "Request for Quote",
    from: "Sunrise Co.",
    preview:
      "We are interested in getting a quote for custom embroidered patches for our team uniforms...",
    date: "Oct 19, 9:00am",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Custom Embroidered Patches",
    category: "Patches",
    price: "$45.00",
    emoji: "🟧",
  },
  {
    id: 2,
    name: "Logo Design Service",
    category: "Services",
    price: "$120.00",
    emoji: "🎨",
  },
  {
    id: 3,
    name: "Custom T-Shirt Printing",
    category: "Apparel",
    price: "$25.00",
    emoji: "👕",
  },
  {
    id: 4,
    name: "Business Cards (500 pack)",
    category: "Print",
    price: "$89.00",
    emoji: "🪪",
  },
  {
    id: 5,
    name: "Promotional Stickers",
    category: "Stickers",
    price: "$35.00",
    emoji: "⭐",
  },
  {
    id: 6,
    name: "Banner Printing",
    category: "Print",
    price: "$150.00",
    emoji: "🖼️",
  },
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    title: "Spring Sale 2026",
    description: "Get 30% off on all spring collection!",
    type: "Promotion",
    subject: "Spring Sale 2026 - 30% Off Everything",
    content:
      "Dear valued customer,\n\nGet 30% off on all spring collection! Don't miss out on this limited-time offer.\n\nBest regards,\nThe Team",
    status: "sent",
    recipients: 1240,
    created: "May 15, 2026",
    products: [PRODUCTS[0], PRODUCTS[1]],
    audience: "All Customers",
  },
  {
    id: 2,
    title: "Weekly Newsletter - May",
    description: "What's new this week at MakServ",
    type: "Newsletter",
    subject: "Weekly Newsletter - May Edition",
    content:
      "Dear valued customer,\n\nHere's what's new this week at MakServ. We have exciting updates to share with you.\n\nBest regards,\nThe Team",
    status: "sent",
    recipients: 3450,
    created: "May 20, 2026",
    products: [],
    audience: "Subscribers",
  },
  {
    id: 3,
    title: "Summer Discount Campaign",
    description: "Exclusive 25% discount just for you!",
    type: "Discount",
    subject: "Summer Discount - 25% Off",
    content:
      "Dear valued customer,\n\nExclusive 25% discount just for you! Use code SUMMER25 at checkout.\n\nBest regards,\nThe Team",
    status: "sent",
    recipients: 2100,
    created: "May 28, 2026",
    products: [PRODUCTS[2], PRODUCTS[3]],
    audience: "VIP Customers",
  },
  {
    id: 4,
    title: "Product Launch Announcement",
    description: "Introducing our new product line",
    type: "Newsletter",
    subject: "Exciting New Products Available Now!",
    content:
      "Dear valued customer,\n\nWe're thrilled to introduce our new product line. Check out what's available now.\n\nBest regards,\nThe Team",
    status: "draft",
    recipients: null,
    created: "May 30, 2026",
    products: [PRODUCTS[0]],
    audience: "",
  },
  {
    id: 5,
    title: "Memorial Day Sale",
    description: "Memorial Day Special - Limited Time Offer",
    type: "Promotion",
    subject: "Memorial Day Sale - Shop Now!",
    content:
      "Dear valued customer,\n\nMemorial Day Special is here! Limited time offers on selected items.\n\nBest regards,\nThe Team",
    status: "sent",
    recipients: 1875,
    created: "May 25, 2026",
    products: [PRODUCTS[4], PRODUCTS[5]],
    audience: "All Customers",
  },
  {
    id: 6,
    title: "Customer Appreciation",
    description: "Thank you! Here's 15% off your next order",
    type: "Discount",
    subject: "A Special Thank You - 15% Off",
    content:
      "Dear valued customer,\n\nThank you for your continued support! Enjoy 15% off your next order with code THANKS15.\n\nBest regards,\nThe Team",
    status: "draft",
    recipients: null,
    created: "May 31, 2026",
    products: [PRODUCTS[1]],
    audience: "",
  },
];

export const TYPE_ICON: Record<CampaignType, string> = {
  Newsletter: "✉️",
  Promotion: "📈",
  Discount: "🏷️",
};
