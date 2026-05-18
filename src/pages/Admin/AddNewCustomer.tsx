import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, User, UserPlus, FileText, MapPin, Tag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AddNewCustomer = () => {
  const [customerType, setCustomerType] = useState<"business" | "personal">("business");

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full pb-10">
      {/* Header Area */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/admin/customers" className="mt-1">
            <ArrowLeft className="w-5 h-5 text-[#5C7899] hover:text-[#111827]" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-[#111827] mb-1">
              Add New Customer
            </h1>
            <p className="text-sm text-[#5C7899]">
              Create a new customer profile
            </p>
          </div>
        </div>
        <Button className="h-10 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white rounded-lg gap-2 font-medium">
          <UserPlus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Customer Type Card */}
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
            <h2 className="text-lg font-bold text-[#111827] mb-1">Customer Type</h2>
            <p className="text-sm text-[#5C7899] mb-4">Select the type of customer</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setCustomerType("business")}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                  customerType === "business" 
                    ? "border-[#0077FF] bg-[#F5F8FF]" 
                    : "border-[#E6EBF2] bg-white hover:border-[#A0B0C0]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className={`w-5 h-5 ${customerType === "business" ? "text-[#0077FF]" : "text-[#A0B0C0]"}`} />
                  <span className={`font-semibold ${customerType === "business" ? "text-[#0077FF]" : "text-[#5C7899]"}`}>Business Customer</span>
                </div>
                <p className={`text-xs ${customerType === "business" ? "text-[#0077FF]/80" : "text-[#A0B0C0]"}`}>Company or organization</p>
              </button>

              <button 
                onClick={() => setCustomerType("personal")}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                  customerType === "personal" 
                    ? "border-[#7E22CE] bg-[#FAF5FF]" 
                    : "border-[#E6EBF2] bg-white hover:border-[#A0B0C0]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <User className={`w-5 h-5 ${customerType === "personal" ? "text-[#7E22CE]" : "text-[#A0B0C0]"}`} />
                  <span className={`font-semibold ${customerType === "personal" ? "text-[#7E22CE]" : "text-[#5C7899]"}`}>Personal Customer</span>
                </div>
                <p className={`text-xs ${customerType === "personal" ? "text-[#7E22CE]/80" : "text-[#A0B0C0]"}`}>Events, gifts, personal orders</p>
              </button>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7FF] flex items-center justify-center">
                <User className="w-5 h-5 text-[#0077FF]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Personal Information</h2>
                <p className="text-xs text-[#5C7899]">Basic contact details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-xs text-[#111827] font-semibold">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="John" className="h-10 border-[#E6EBF2]" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-[#111827] font-semibold">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="Smith" className="h-10 border-[#E6EBF2]" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs text-[#111827] font-semibold">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="john.smith@example.com" className="h-10 border-[#E6EBF2]" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-[#111827] font-semibold">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="(555) 123-4567" className="h-10 border-[#E6EBF2]" />
              </div>
              {customerType === "business" && (
                <div className="space-y-2">
                  <Label className="text-xs text-[#111827] font-semibold">Website</Label>
                  <Input placeholder="https://example.com" className="h-10 border-[#E6EBF2]" />
                </div>
              )}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs text-[#111827] font-semibold">
                  Language Preference <span className="text-red-500">*</span>
                </Label>
                <select className="flex h-10 w-full rounded-md border border-[#E6EBF2] bg-white px-3 py-2 text-sm outline-none focus:border-[#0077FF]">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>

            <Button variant="outline" className="w-full border-[#E6EBF2] text-[#0077FF] font-medium bg-[#F8FAFC]">
              + Add Secondary Contact
            </Button>
          </div>

          {/* Conditional Card based on Type */}
          {customerType === "business" ? (
            <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#FAF5FF] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#7E22CE]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">Company Information</h2>
                  <p className="text-xs text-[#5C7899]">Business details</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs text-[#111827] font-semibold">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input placeholder="Acme Corporation" className="h-10 border-[#E6EBF2]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-[#111827] font-semibold">Tax ID / EIN</Label>
                  <Input placeholder="XX-XXXXXXX" className="h-10 border-[#E6EBF2]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#FAF5FF] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#7E22CE]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">Order Details</h2>
                  <p className="text-xs text-[#5C7899]">Event or gift information</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs text-[#111827] font-semibold">
                    Order Purpose <span className="text-red-500">*</span>
                  </Label>
                  <Input placeholder="" className="h-10 border-[#E6EBF2]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs text-[#111827] font-semibold">Event Type</Label>
                    <Input placeholder="e.g., Garden Wedding, 50th Birthday" className="h-10 border-[#E6EBF2]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#111827] font-semibold">Event Date</Label>
                    <Input type="date" className="h-10 border-[#E6EBF2]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address Information Card */}
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Address Information</h2>
                <p className="text-xs text-[#5C7899]">Billing and shipping address</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs text-[#111827] font-semibold">Street Address</Label>
                <Input placeholder="123 Main Street, Suite 100" className="h-10 border-[#E6EBF2]" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs text-[#111827] font-semibold">City</Label>
                  <Input placeholder="New York" className="h-10 border-[#E6EBF2]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-[#111827] font-semibold">State / Province</Label>
                  <Input placeholder="NY" className="h-10 border-[#E6EBF2]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-[#111827] font-semibold">ZIP / Postal Code</Label>
                  <Input placeholder="10001" className="h-10 border-[#E6EBF2]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-[#111827] font-semibold">Country</Label>
                  <select className="flex h-10 w-full rounded-md border border-[#E6EBF2] bg-white px-3 py-2 text-sm outline-none focus:border-[#0077FF]">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] flex items-center justify-center">
                <Tag className="w-5 h-5 text-[#D97706]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Additional Information</h2>
                <p className="text-xs text-[#5C7899]">Tags and notes</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs text-[#111827] font-semibold">Tags</Label>
                <div className="flex gap-2">
                  <Input placeholder="Add a tag (e.g., VIP, Regular)" className="h-10 border-[#E6EBF2] flex-1" />
                  <Button variant="secondary" className="bg-[#F1F5F9] text-[#111827] hover:bg-[#E2E8F0]">Add</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-[#111827] font-semibold">Notes</Label>
                <textarea 
                  className="w-full h-32 border border-[#E6EBF2] rounded-md p-3 text-sm outline-none focus:border-[#0077FF]" 
                  placeholder="Add any additional notes about this customer..."
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar Area */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
          
          {/* Actions Card */}
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
            <h2 className="text-sm font-bold text-[#111827] mb-4">Actions</h2>
            <div className="space-y-3">
              <Button className="w-full h-10 bg-[#0077FF] hover:bg-[#0060CE] text-white rounded-lg flex items-center justify-center gap-2">
                Save Customer
              </Button>
              <Button variant="outline" className="w-full h-10 border-[#E6EBF2] bg-[#F8FAFC] text-[#5C7899] hover:text-[#111827] rounded-lg">
                Cancel
              </Button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
            <h2 className="text-sm font-bold text-[#111827] mb-4">Quick Tips</h2>
            <ul className="space-y-3 text-xs text-[#5C7899] list-disc pl-4">
              <li>All fields marked with <span className="text-red-500">*</span> are required</li>
              <li>Use tags to organize customers</li>
              <li>Add notes for internal reference</li>
            </ul>
          </div>

          {/* Payment Terms Card */}
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
            <h2 className="text-sm font-bold text-[#111827] mb-4">Payment Terms</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-[#111827] font-semibold">Credit Limit</Label>
                <Input placeholder="$0.00" className="h-10 border-[#E6EBF2]" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-[#111827] font-semibold">Payment Terms</Label>
                <select className="flex h-10 w-full rounded-md border border-[#E6EBF2] bg-white px-3 py-2 text-sm outline-none focus:border-[#0077FF]">
                  <option>Net 30</option>
                  <option>Net 60</option>
                  <option>Due on Receipt</option>
                </select>
              </div>
              <label className="flex items-start gap-2 cursor-pointer pt-2">
                <input type="checkbox" className="mt-1 rounded border-[#A0B0C0] text-[#0077FF] focus:ring-[#0077FF]" />
                <div>
                  <div className="text-sm font-semibold text-[#111827]">Tax-Exempt Customer</div>
                  <div className="text-xs text-[#A0B0C0]">Check this if the customer is exempt from sales tax</div>
                </div>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddNewCustomer;
