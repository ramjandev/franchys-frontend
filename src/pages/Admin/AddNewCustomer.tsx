import ActionsCard from "@/components/customer/ActionsCard";
import AdditionalInformationCard from "@/components/customer/AdditionalInformationCard";
import AddressInformationCard from "@/components/customer/AddressInformationCard";
import CompanyInformation from "@/components/customer/CompanyInformation";
import CustomerTab from "@/components/customer/CustomerTab";
import OrderDetails from "@/components/customer/OrderDetails";
import PaymentTermsCard from "@/components/customer/PaymentTermsCard";
import PersonalInformation from "@/components/customer/PersonalInformation";
import CommonHeader from "@/components/shared/CommonHeader";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { useState } from "react";

const AddNewCustomer = () => {
  const [customerType, setCustomerType] = useState<"business" | "personal">(
    "business",
  );

  return (
    <div className="flex flex-col gap-6 ">
      <DashboardTopSection
        title="Add New Customer"
        description="Create a new customer profile"
        backButton
      />

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
            <CommonHeader size="lg">Customer Type</CommonHeader>
            <CommonHeader size="xs">Select the type of customer</CommonHeader>

            <CustomerTab
              customerType={customerType}
              setCustomerType={setCustomerType}
            />
          </div>

          <PersonalInformation customerType={customerType} />

          {customerType === "business" ? (
            <CompanyInformation />
          ) : (
            <OrderDetails />
          )}
          <AddressInformationCard />
          <AdditionalInformationCard />
        </div>

        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
          <ActionsCard />
          <PaymentTermsCard />
        </div>
      </div>
    </div>
  );
};

export default AddNewCustomer;
