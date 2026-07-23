import ActionsCard from "@/components/customer/ActionsCard";
import AdditionalInformationCard from "@/components/customer/AdditionalInformationCard";
import AddressInformationCard from "@/components/customer/AddressInformationCard";
import CompanyInformation from "@/components/customer/CompanyInformation";
import CustomerTab from "@/components/customer/CustomerTab";
import OrderDetails from "@/components/customer/OrderDetails";
import PaymentTermsCard from "@/components/customer/PaymentTermsCard";
import PersonalInformation from "@/components/customer/PersonalInformation";
import {
  CustomerFormValues,
  customerSchema,
} from "@/components/customer/schema/customerSchema";
import CommonHeader from "@/components/shared/CommonHeader";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { useCreateCustomerMutation } from "@/store/Customer/customerAPI";
import { CreateCustomerRequest } from "@/store/Customer/types/customerTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const defaultValues: CustomerFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  customerType: "BUSINESS",
  language: "English",
  website: "",
  companyName: "",
  taxId: "",
  secondaryFirstName: "",
  secondaryLastName: "",
  secondaryEmail: "",
  secondaryPhone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  tags: [],
  notes: "",
  orderPurpose: "",
  eventType: "",
  eventDate: "",
  profileImage: "",
};

const AddNewCustomer = () => {
  const navigate = useNavigate();
  const [showSecondary, setShowSecondary] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const customerTypeValue = watch("customerType");
  const customerType: "business" | "personal" =
    customerTypeValue === "BUSINESS" ? "business" : "personal";

  const setCustomerType = (type: "business" | "personal") => {
    setValue("customerType", type === "business" ? "BUSINESS" : "PERSONAL", {
      shouldValidate: true,
    });
  };

  const tags = watch("tags") || [];

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setValue("tags", [...tags, tagInput.trim()]);
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
    );
  };

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const payload: CreateCustomerRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        customerType: data.customerType,
        language: data.language,
        website: data.website,
        companyName: data.companyName,
        taxId: data.taxId,
        secondaryEmail: showSecondary ? data.secondaryEmail : undefined,
        secondaryPhone: showSecondary ? data.secondaryPhone : undefined,
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        tags: data.tags,
        notes: data.notes,
        orderPurpose: data.orderPurpose,
        eventType: data.eventType,
        eventDate: data.eventDate
          ? new Date(data.eventDate).toISOString()
          : undefined,
        profileImage: data.profileImage,
      };

      await createCustomer(payload).unwrap();
      toast.success("Customer created successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create customer");
    }
  };

  const onError = () => {
    toast.error("Please fix the highlighted fields");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <form
      className="flex flex-col gap-6 "
      onSubmit={handleSubmit(onSubmit, onError)}
      noValidate
    >
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

          <PersonalInformation
            customerType={customerType}
            register={register}
            control={control}
            errors={errors}
            showSecondary={showSecondary}
            setShowSecondary={setShowSecondary}
          />

          {customerType === "business" ? (
            <CompanyInformation register={register} errors={errors} />
          ) : (
            <OrderDetails register={register} errors={errors} />
          )}
          <AddressInformationCard
            register={register}
            control={control}
            errors={errors}
          />
          <AdditionalInformationCard
            tags={tags}
            tagInput={tagInput}
            setTagInput={setTagInput}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            register={register}
          />
        </div>

        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
          <ActionsCard onCancel={handleCancel} isLoading={isLoading} />
          <PaymentTermsCard />
        </div>
      </div>
    </form>
  );
};

export default AddNewCustomer;
