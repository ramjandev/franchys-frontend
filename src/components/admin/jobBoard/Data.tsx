export type ViewMode = "kanban" | "list";

interface StatusOption {
  key: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  text: string;
}

interface Badge {
  text: string;
  color: string;
  textColor: string;
}

export interface JobCard {
  jobId: string;
  title: string;
  badge: Badge;
  customer: string;
  contact: string;
  due?: string;
  amount: string;
  quoteId: string;
  status: string;
  productionStage: string;
}

export interface Column {
  id: string;
  title: string;
  count: number;
  emoji: string;
  headerColor: string;
  cards: JobCard[];
}

interface StatusFilter {
  label: string;
  count: number;
  image: string;
  cardClassName: string;
  textClassName: string;
}

interface WorkflowStage {
  emoji: string;
  label: string;
  items: string[];
  itemColors: string[];
}

export interface ListRow extends JobCard {
  colId: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  {
    key: "quote",
    label: "Quote",
    color: "#FF6B6B",
    bg: "bg-[#FF6B6B]/[.125]",
    border: "border-[#FF6B6B]/[.375]",
    text: "text-[#FF6B6B]",
  },
  {
    key: "approved",
    label: "Approved",
    color: "#4ECDC4",
    bg: "bg-[#4ECDC4]/[.125]",
    border: "border-[#4ECDC4]/[.375]",
    text: "text-[#4ECDC4]",
  },
  {
    key: "art",
    label: "Art",
    color: "#95E1D3",
    bg: "bg-[#95E1D3]/[.125]",
    border: "border-[#95E1D3]/[.375]",
    text: "text-[#95E1D3]",
  },
  {
    key: "needOrder",
    label: "Need to Order",
    color: "#F38181",
    bg: "bg-[#F38181]/[.125]",
    border: "border-[#F38181]/[.375]",
    text: "text-[#F38181]",
  },
  {
    key: "arrived",
    label: "Order Arrived",
    color: "#AA96DA",
    bg: "bg-[#AA96DA]/[.125]",
    border: "border-[#AA96DA]/[.375]",
    text: "text-[#AA96DA]",
  },
  {
    key: "production",
    label: "Production",
    color: "#FF8B5A",
    bg: "bg-[#FF8B5A]/[.125]",
    border: "border-[#FF8B5A]/[.375]",
    text: "text-[#FF8B5A]",
  },
  {
    key: "payment",
    label: "Payment",
    color: "#4ADE80",
    bg: "bg-[#4ADE80]/[.125]",
    border: "border-[#4ADE80]/[.375]",
    text: "text-[#4ADE80]",
  },
  {
    key: "ship",
    label: "Ship",
    color: "#3B82F6",
    bg: "bg-[#3B82F6]/[.125]",
    border: "border-[#3B82F6]/[.375]",
    text: "text-[#1E40AF]",
  },
  {
    key: "completed",
    label: "Completed",
    color: "#8B5CF6",
    bg: "bg-[#8B5CF6]/[.125]",
    border: "border-[#8B5CF6]/[.375]",
    text: "text-[#8B5CF6]",
  },
];

export const STATUS_MAP: Record<string, StatusOption> = Object.fromEntries(
  STATUS_OPTIONS.map((s) => [s.key, s]),
);

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    emoji: "🎨",
    label: "1. Art Stage",
    items: [
      "Art (TO DO)",
      "Art For Approval Sent",
      "Art Approved",
      "Re-Design",
    ],
    itemColors: [
      "bg-[#FCA5A5] text-[#7F1D1D]",
      "bg-[#F87171] text-white",
      "bg-[#EF4444] text-white",
      "bg-[#7F1D1D] text-white",
    ],
  },
  {
    emoji: "⚙️",
    label: "2. Preparation Stage",
    items: [
      "Need to Order",
      "Items Ordered",
      "Items Arrived",
      "Ready for Production",
    ],
    itemColors: [
      "bg-[#DB2777] text-white",
      "bg-[#9D174D] text-white",
      "bg-[#EC4899] text-white",
      "bg-[#A855F7] text-white",
    ],
  },
  {
    emoji: "🏭",
    label: "3. Production Stage",
    items: [
      "Working on it",
      "Digital Printing",
      "Embroidery",
      "Apparel Printing",
      "SUBS in Production",
    ],
    itemColors: [
      "bg-[#7C3AED] text-white",
      "bg-[#6D28D9] text-white",
      "bg-[#5B21B6] text-white",
      "bg-[#4C1D95] text-white",
      "bg-[#3B0764] text-white",
    ],
  },
  {
    emoji: "🚚",
    label: "4. Delivery Stage",
    items: ["Ready to Package", "Ready for Pickup", "Order Shipped"],
    itemColors: [
      "bg-[#D97706] text-white",
      "bg-[#B45309] text-white",
      "bg-[#92400E] text-white",
    ],
  },
];

export const STATUS_FILTERS: StatusFilter[] = [
  {
    label: "QUOTE",
    count: 3,
    image: "📋",
    cardClassName: "bg-[#F9FAFB] border-[#D1D5DB]",
    textClassName: "text-[#4B5563]",
  },
  {
    label: "ART",
    count: 4,
    image: "🎨",
    cardClassName: "bg-[#FDF2F8] border-[#F0ABFC]",
    textClassName: "text-[#9333EA]",
  },
  {
    label: "PREPARATION",
    count: 4,
    image: "⚙️",
    cardClassName: "bg-[#EFF6FF] border-[#BFDBFE]",
    textClassName: "text-[#2563EB]",
  },
  {
    label: "PRODUCTION",
    count: 5,
    image: "🏭",
    cardClassName: "bg-[#FEFCE8] border-[#FDE047]",
    textClassName: "text-[#CA8A04]",
  },
  {
    label: "PAYMENT",
    count: 2,
    image: "💳",
    cardClassName: "bg-[#F0FDF4] border-[#BBF7D0]",
    textClassName: "text-[#16A34A]",
  },
  {
    label: "DELIVER",
    count: 3,
    image: "🚚",
    cardClassName: "bg-[#F0FDF4] border-[#BBF7D0]",
    textClassName: "text-[#059669]",
  },
];

export const INITIAL_COLUMNS: Column[] = [
  {
    id: "quote",
    title: "QUOTE",
    count: 3,
    emoji: "📋",
    headerColor: "bg-[#4B5563]",
    cards: [
      {
        jobId: "J-2004",
        title: "Custom Welcome Banners",
        badge: {
          text: "3. Working on it",
          color: "bg-[#7C3AED]",
          textColor: "text-white",
        },
        customer: "Riverside Church",
        contact: "Sarah M.",
        due: "Apr 15, 2026",
        amount: "$1,200.00",
        quoteId: "Q-1001",
        status: "quote",
        productionStage: "Art",
      },
      {
        jobId: "J-2005",
        title: "CrossFit Competition Tees",
        badge: {
          text: "2. Need To Order",
          color: "bg-[#DB2777]",
          textColor: "text-white",
        },
        customer: "Summit CrossFit",
        contact: "Mike T.",
        due: "Apr 12, 2026",
        amount: "$2,800.00",
        quoteId: "Q-1002",
        status: "quote",
        productionStage: "Art",
      },
      {
        jobId: "J-2016",
        title: "Youth Camp Hoodies",
        badge: {
          text: "1. Art (TO DO)",
          color: "bg-[#FCA5A5]",
          textColor: "text-[#7F1D1D]",
        },
        customer: "Lakeside Camp",
        contact: "Amy R.",
        due: "Apr 30, 2026",
        amount: "$980.00",
        quoteId: "Q-1023",
        status: "quote",
        productionStage: "Art",
      },
    ],
  },
  {
    id: "art",
    title: "ART",
    count: 4,
    emoji: "🎨",
    headerColor: "bg-[#9333EA]",
    cards: [
      {
        jobId: "J-2006",
        title: "Station 42 Polos & Hoodies",
        badge: {
          text: "1. Art (TO DO)",
          color: "bg-[#FCA5A5]",
          textColor: "text-[#7F1D1D]",
        },
        customer: "Metro Fire Department",
        contact: "Jessica H.",
        due: "Apr 18, 2026",
        amount: "$3,920.00",
        quoteId: "Q-1003",
        status: "art",
        productionStage: "Need to Order",
      },
      {
        jobId: "J-2007",
        title: "School Mascot T-Shirts",
        badge: {
          text: "1. Art For Approval Sent",
          color: "bg-[#FCA5A5]",
          textColor: "text-[#7F1D1D]",
        },
        customer: "Lincoln High School",
        contact: "Jessica H.",
        due: "Apr 18, 2026",
        amount: "$1,450.00",
        quoteId: "Q-1009",
        status: "art",
        productionStage: "Order Arrived",
      },
      {
        jobId: "J-2017",
        title: "Yoga Studio Tank Tops",
        badge: {
          text: "1. Art Approved",
          color: "bg-[#EF4444]",
          textColor: "text-white",
        },
        customer: "Zen Flow Studio",
        contact: "Nina P.",
        due: "May 01, 2026",
        amount: "$760.00",
        quoteId: "Q-1024",
        status: "art",
        productionStage: "In Production",
      },
    ],
  },
  {
    id: "preparation",
    title: "PREPARATION",
    count: 4,
    emoji: "⚙️",
    headerColor: "bg-[#2563EB]",
    cards: [
      {
        jobId: "J-2008",
        title: "Tech Conference Lanyards",
        badge: {
          text: "2. Need To Order",
          color: "bg-[#DB2777]",
          textColor: "text-white",
        },
        customer: "Innovation Summit",
        contact: "Tom R.",
        due: "Apr 20, 2026",
        amount: "$890.00",
        quoteId: "Q-1016",
        status: "needOrder",
        productionStage: "Ready to Ship",
      },
      {
        jobId: "J-2009",
        title: "Brewery Staff Aprons",
        badge: {
          text: "2. Items Ordered",
          color: "bg-[#9D174D]",
          textColor: "text-white",
        },
        customer: "Craft Brewery Co",
        contact: "Tom R.",
        due: "Apr 22, 2026",
        amount: "$604.80",
        quoteId: "Q-1004",
        status: "arrived",
        productionStage: "Ready to Ship",
      },
      {
        jobId: "J-2018",
        title: "Soccer Club Jerseys",
        badge: {
          text: "2. Items Arrived",
          color: "bg-[#EC4899]",
          textColor: "text-white",
        },
        customer: "Eastside FC",
        contact: "Carlos M.",
        due: "May 03, 2026",
        amount: "$2,340.00",
        quoteId: "Q-1025",
        status: "arrived",
        productionStage: "Ready to Ship",
      },
    ],
  },
  {
    id: "production",
    title: "PRODUCTION",
    count: 5,
    emoji: "🏭",
    headerColor: "bg-[#EA580C]",
    cards: [
      {
        jobId: "J-2010",
        title: "Startup Logo Tees",
        badge: {
          text: "3. Working on it",
          color: "bg-[#7C3AED]",
          textColor: "text-white",
        },
        customer: "CodeFlow Inc",
        contact: "Lisa K.",
        due: "Apr 25, 2026",
        amount: "$1,290.00",
        quoteId: "Q-1018",
        status: "production",
        productionStage: "In Production",
      },
      {
        jobId: "J-2011",
        title: "Marketing Banners",
        badge: {
          text: "3. Digital Printing in Production",
          color: "bg-[#6D28D9]",
          textColor: "text-white",
        },
        customer: "Brand Boost Co",
        contact: "Lisa K.",
        due: "Apr 28, 2026",
        amount: "$2,100.00",
        quoteId: "Q-1019",
        status: "production",
        productionStage: "In Production",
      },
      {
        jobId: "J-2019",
        title: "Nursing Staff Scrubs",
        badge: {
          text: "3. Embroidery",
          color: "bg-[#5B21B6]",
          textColor: "text-white",
        },
        customer: "City Medical Ctr",
        contact: "Rachel W.",
        due: "May 06, 2026",
        amount: "$4,500.00",
        quoteId: "Q-1026",
        status: "production",
        productionStage: "In Production",
      },
    ],
  },
  {
    id: "payment",
    title: "PAYMENT",
    count: 2,
    emoji: "💳",
    headerColor: "bg-[#16A34A]",
    cards: [
      {
        jobId: "J-2012",
        title: "Tech Summit Swag Bags",
        badge: {
          text: "1. Art For Approval Sent",
          color: "bg-[#FCA5A5]",
          textColor: "text-[#7F1D1D]",
        },
        customer: "Bay Area Tech Summit",
        contact: "David L.",
        due: "Apr 10, 2026",
        amount: "$8,100.00",
        quoteId: "Q-1006",
        status: "payment",
        productionStage: "Ready to Ship",
      },
      {
        jobId: "J-2013",
        title: "Charity Run T-Shirts",
        badge: {
          text: "Paid in Full",
          color: "bg-[#A7F3D0]",
          textColor: "text-[#065F46]",
        },
        customer: "Hope Foundation",
        contact: "David L.",
        due: "May 02, 2026",
        amount: "$2,450.00",
        quoteId: "Q-1014",
        status: "payment",
        productionStage: "Ready to Ship",
      },
      {
        jobId: "J-2020",
        title: "Alumni Reunion Polos",
        badge: {
          text: "Deposit Received",
          color: "bg-[#BBF7D0]",
          textColor: "text-[#14532D]",
        },
        customer: "Westview University",
        contact: "Karen S.",
        due: "May 10, 2026",
        amount: "$3,750.00",
        quoteId: "Q-1027",
        status: "payment",
        productionStage: "Ready to Ship",
      },
    ],
  },
  {
    id: "deliver",
    title: "DELIVER",
    count: 3,
    emoji: "🚚",
    headerColor: "bg-[#059669]",
    cards: [
      {
        jobId: "J-2014",
        title: "Corporate Polo Shirts",
        badge: {
          text: "4. Completed - Ready to Package",
          color: "bg-[#D97706]",
          textColor: "text-white",
        },
        customer: "Anderson Corp",
        contact: "David L.",
        due: "May 05, 2026",
        amount: "$3,200.00",
        quoteId: "Q-1013",
        status: "ship",
        productionStage: "Ready to Ship",
      },
      {
        jobId: "J-2015",
        title: "Restaurant Merchandise",
        badge: {
          text: "4. Order Ready for Pickup",
          color: "bg-[#B45309]",
          textColor: "text-white",
        },
        customer: "Bella Italia",
        contact: "David L.",
        due: "May 08, 2026",
        amount: "$1,560.00",
        quoteId: "Q-1022",
        status: "ship",
        productionStage: "Ready to Ship",
      },
      {
        jobId: "J-2021",
        title: "Gym Branded Water Bottles",
        badge: {
          text: "4. Order Shipped",
          color: "bg-[#92400E]",
          textColor: "text-white",
        },
        customer: "Iron Peak Gym",
        contact: "James T.",
        due: "May 12, 2026",
        amount: "$870.00",
        quoteId: "Q-1028",
        status: "ship",
        productionStage: "Ready to Ship",
      },
    ],
  },
];
