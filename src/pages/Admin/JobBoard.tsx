import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, FileText, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for Job Board Kanban
const columns = [
  {
    id: "quote",
    title: "QUOTE",
    count: 3,
    color: "bg-[#4B5563]", // Gray
    cards: [
      {
        jobId: "J-2004",
        title: "Custom Welcome Banners",
        badge: { text: "3. Working on it", color: "bg-[#7C3AED]", textColor: "text-white" },
        customer: "Riverside Church",
        contact: "Sarah M.",
        due: "Apr 15, 2026",
        amount: "$1,200.00",
        quoteId: "Q-1001"
      },
      {
        jobId: "J-2005",
        title: "CrossFit Competition Tees",
        badge: { text: "2. Need To Order", color: "bg-[#DB2777]", textColor: "text-white" },
        customer: "Summit CrossFit",
        contact: "Mike T.",
        due: "Apr 12, 2026",
        amount: "$2,800.00",
        quoteId: "Q-1002"
      }
    ]
  },
  {
    id: "art",
    title: "ART",
    count: 4,
    color: "bg-[#9333EA]", // Purple
    cards: [
      {
        jobId: "J-2006",
        title: "Station 42 Polos & Hoodies",
        badge: { text: "1. Art (TO DO)", color: "bg-[#FCA5A5]", textColor: "text-[#7F1D1D]" },
        customer: "Metro Fire Department",
        contact: "Jessica H.",
        due: "Apr 18, 2026",
        amount: "$3,920.00",
        quoteId: "Q-1003"
      },
      {
        jobId: "J-2007",
        title: "School Mascot T-Shirts",
        badge: { text: "1. Art For Approval Sent", color: "bg-[#FCA5A5]", textColor: "text-[#7F1D1D]" },
        customer: "Lincoln High School",
        contact: "Jessica H.",
        due: "Apr 18, 2026",
        amount: "$1,450.00",
        quoteId: "Q-1009"
      }
    ]
  },
  {
    id: "preparation",
    title: "PREPARATION",
    count: 4,
    color: "bg-[#2563EB]", // Blue
    cards: [
      {
        jobId: "J-2008",
        title: "Tech Conference Lanyards",
        badge: { text: "2. Need To Order", color: "bg-[#DB2777]", textColor: "text-white" },
        customer: "Innovation Summit",
        contact: "Tom R.",
        due: "Apr 20, 2026",
        amount: "$890.00",
        quoteId: "Q-1016"
      },
      {
        jobId: "J-2009",
        title: "Brewery Staff Aprons",
        badge: { text: "2. Items Ordered", color: "bg-[#9D174D]", textColor: "text-white" },
        customer: "Craft Brewery Co",
        contact: "Tom R.",
        due: "Apr 22, 2026",
        amount: "$604.80",
        quoteId: "Q-1004"
      }
    ]
  },
  {
    id: "production",
    title: "PRODUCTION",
    count: 5,
    color: "bg-[#EA580C]", // Orange
    cards: [
      {
        jobId: "J-2010",
        title: "Startup Logo Tees",
        badge: { text: "3. Working on it", color: "bg-[#7C3AED]", textColor: "text-white" },
        customer: "CodeFlow Inc",
        contact: "Lisa K.",
        due: "Apr 25, 2026",
        amount: "$1,290.00",
        quoteId: "Q-1018"
      },
      {
        jobId: "J-2011",
        title: "Marketing Banners",
        badge: { text: "3. Digital Printing in Production", color: "bg-[#6D28D9]", textColor: "text-white" },
        customer: "Brand Boost Co",
        contact: "Lisa K.",
        due: "Apr 28, 2026",
        amount: "$2,100.00",
        quoteId: "Q-1019"
      }
    ]
  },
  {
    id: "payment",
    title: "PAYMENT",
    count: 2,
    color: "bg-[#16A34A]", // Green
    cards: [
      {
        jobId: "J-2012",
        title: "Tech Summit Swag Bags",
        badge: { text: "1. Art For Approval Sent", color: "bg-[#FCA5A5]", textColor: "text-[#7F1D1D]" },
        customer: "Bay Area Tech Summit",
        contact: "David L.",
        due: "Apr 10, 2026",
        amount: "$8,100.00",
        quoteId: "Q-1006"
      },
      {
        jobId: "J-2013",
        title: "Charity Run T-Shirts",
        badge: { text: "Paid in Full", color: "bg-[#A7F3D0]", textColor: "text-[#065F46]" },
        customer: "Hope Foundation",
        contact: "David L.",
        due: "May 02, 2026",
        amount: "$2,450.00",
        quoteId: "Q-1014"
      }
    ]
  },
  {
    id: "deliver",
    title: "DELIVER",
    count: 3,
    color: "bg-[#059669]", // Dark Green
    cards: [
      {
        jobId: "J-2014",
        title: "Corporate Polo Shirts",
        badge: { text: "4. Completed - Ready to Package", color: "bg-[#D97706]", textColor: "text-white" },
        customer: "Anderson Corp",
        contact: "David L.",
        due: "May 05, 2026",
        amount: "$3,200.00",
        quoteId: "Q-1013"
      },
      {
        jobId: "J-2015",
        title: "Restaurant Merchandise",
        badge: { text: "4. Order Ready for Pickup", color: "bg-[#B45309]", textColor: "text-white" },
        customer: "Bella Italia",
        contact: "David L.",
        due: "May 08, 2026",
        amount: "$1,560.00",
        quoteId: "Q-1022"
      }
    ]
  }
];

const JobBoard = () => {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/admin/dashboard" className="mt-1">
            <ArrowLeft className="w-5 h-5 text-[#5C7899] hover:text-[#111827]" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-[#111827] mb-1">
              Jobs Board
            </h1>
            <p className="text-sm text-[#5C7899]">
              Drag cards between columns to update status.
            </p>
          </div>
        </div>
        
        {/* Top Filters/Indicators */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <button className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[#E6EBF2] text-xs font-medium text-[#5C7899] whitespace-nowrap shadow-sm hover:bg-slate-50">
            <span className="w-3 h-3 rounded bg-[#4B5563]" /> 3 QUOTE
          </button>
          <button className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[#E6EBF2] text-xs font-medium text-[#5C7899] whitespace-nowrap shadow-sm hover:bg-slate-50">
            <span className="w-3 h-3 rounded bg-[#9333EA]" /> 4 ART
          </button>
          <button className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[#E6EBF2] text-xs font-medium text-[#5C7899] whitespace-nowrap shadow-sm hover:bg-slate-50">
            <span className="w-3 h-3 rounded bg-[#2563EB]" /> 4 PREPARATION
          </button>
          <button className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[#E6EBF2] text-xs font-medium text-[#5C7899] whitespace-nowrap shadow-sm hover:bg-slate-50">
            <span className="w-3 h-3 rounded bg-[#EA580C]" /> 5 PRODUCTION
          </button>
          <button className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[#E6EBF2] text-xs font-medium text-[#5C7899] whitespace-nowrap shadow-sm hover:bg-slate-50">
            <span className="w-3 h-3 rounded bg-[#16A34A]" /> 2 PAYMENT
          </button>
          <button className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[#E6EBF2] text-xs font-medium text-[#5C7899] whitespace-nowrap shadow-sm hover:bg-slate-50">
            <span className="w-3 h-3 rounded bg-[#059669]" /> 3 DELIVER
          </button>
        </div>
      </div>

      <div>
        <button className="text-sm text-[#0077FF] hover:underline font-medium">Hide Status Guide</button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {columns.map((col) => (
            <div key={col.id} className="w-[320px] flex flex-col shrink-0 bg-[#F1F5F9]/50 rounded-xl p-3 border border-[#E6EBF2]">
              {/* Column Header */}
              <div className={`${col.color} rounded-t-lg rounded-b-sm px-4 py-3 flex items-center justify-between text-white shadow-sm mb-3`}>
                <h3 className="font-bold text-sm tracking-wide">{col.title}</h3>
                <span className="bg-white/20 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {col.count}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                {col.cards.map((card, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-sm border border-[#E6EBF2] p-4 cursor-grab hover:border-[#CBD5E1] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#0077FF] font-semibold text-sm">{card.jobId}</span>
                      <button className="flex items-center gap-1 text-xs text-[#A0B0C0] border border-[#E6EBF2] px-2 py-0.5 rounded bg-[#F8FAFC]">
                        Quote <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <h4 className="font-bold text-[#111827] text-base mb-3 leading-tight">{card.title}</h4>
                    
                    <div className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-bold mb-4 ${card.badge.color} ${card.badge.textColor}`}>
                      {card.badge.text}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm text-[#5C7899]">
                        <User className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="leading-tight">{card.customer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5C7899]">
                        <User className="w-4 h-4 shrink-0 opacity-50" />
                        <span>{card.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5C7899]">
                        <Calendar className="w-4 h-4 shrink-0 opacity-50" />
                        <span>Due: {card.due}</span>
                      </div>
                    </div>

                    <div className="text-[#16A34A] font-bold text-sm mb-4">
                      $ {card.amount}
                    </div>

                    <div className="pt-3 border-t border-[#F1F5F9] flex items-center gap-2 text-xs text-[#A0B0C0]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{card.quoteId}</span>
                    </div>
                  </div>
                ))}
                
                {/* Empty Drop Zone visually */}
                <div className="h-10 border-2 border-dashed border-[#CBD5E1] rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-[#A0B0C0] text-sm">
                  Drop Here
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
