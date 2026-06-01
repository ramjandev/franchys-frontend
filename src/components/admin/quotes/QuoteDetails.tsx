import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import CommonSelect from "@/components/shared/CommonSelect";
import { inputClass } from "@/pages/Login";
import { Plus } from "lucide-react";
import LineItems from "./LineItems";
import SummaryCard from "./SummaryCard";
const QuoteDetails = () => {
  return (
    <div className=" grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="space-y-6 xl:col-span-2">
        <CardContainer size="lg" className="">
          <div className="flex items-center justify-between mb-6">
            <CommonHeader size="lg">Customer Details</CommonHeader>

            <CommonButton variant="blue">
              <Plus className="w-4 h-4 text-white" /> Add Customer
            </CommonButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={inputClass.label}>
                Date Created <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={inputClass.input}
                defaultValue="2026-05-10"
              />
            </div>
            <div className="space-y-2">
              <label className={inputClass.label}>
                REP / User Name <span className="text-red-500">*</span>
              </label>
              <CommonSelect
                item={[
                  {
                    label: "Ramjan",
                    value: "ramjan",
                  },
                  {
                    label: "John",
                    value: "john",
                  },
                  {
                    label: "Mark",
                    value: "mark",
                  },
                ]}
                value=""
                onValueChange={() => {}}
                placeholder="Select representative"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className={inputClass.label}>
                Select Customer <span className="text-red-500">*</span>
              </label>
              <CommonSelect
                item={[
                  {
                    label: "Primary",
                    value: "primary",
                  },
                  {
                    label: "John",
                    value: "john",
                  },
                  {
                    label: "Mark",
                    value: "mark",
                  },
                ]}
                value=""
                onValueChange={() => {}}
                placeholder="Select a customer"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className={inputClass.label}>Delivery Method</label>

              <CommonSelect
                item={[
                  {
                    label: "Payment on Delivery",
                    value: "payment-on-delivery",
                  },
                  {
                    label: "Pickup",
                    value: "pickup",
                  },
                  {
                    label: "Courier",
                    value: "courier",
                  },
                  {
                    label: "Delivery",
                    value: "delivery",
                  },
                  {
                    label: "Dropship",
                    value: "dropship",
                  },
                ]}
                value=""
                onValueChange={() => {}}
                placeholder="Select delivery method"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className={inputClass.label}>PO Number</label>
              <input
                placeholder="Enter PO number"
                className={inputClass.input}
              />
            </div>
            <div className="space-y-2">
              <label className={inputClass.label}>Customer Due Date</label>
              <input type="date" className={inputClass.input} />
            </div>
          </div>
        </CardContainer>

        <LineItems />

        <CardContainer size="lg">
          <CommonHeader size="lg">Notes & Attachments</CommonHeader>
          <textarea
            className={` ${inputClass.input} mt-2`}
            placeholder="Add terms, turnaround time, or special instructions..."
          />
        </CardContainer>
      </div>
      <div className=" ">
        <SummaryCard />
      </div>
    </div>
  );
};

export default QuoteDetails;
