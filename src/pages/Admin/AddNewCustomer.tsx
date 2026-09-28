import ActionsCard from "@/components/customer/ActionsCard";
import AdditionalInformationCard from "@/components/customer/AdditionalInformationCard";
import AddressInformationCard from "@/components/customer/AddressInformationCard";
import CompanyInformation from "@/components/customer/CompanyInformation";
import CustomerTab from "@/components/customer/CustomerTab";
import PersonalInformation from "@/components/customer/PersonalInformation";
import {
  CustomerFormValues,
  customerSchema,
} from "@/components/customer/schema/customerSchema";
import CommonHeader from "@/components/shared/CommonHeader";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import {
  useCreateCustomerMutation,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "@/store/Customer/customerAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
  isTaxExempt: false,
  taxExemptNumber: "",
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
  eventType: "",
  eventDate: "",
  profileImage: "",
};

const AddNewCustomer = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { data: customerData } = useGetCustomerByIdQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const navigate = useNavigate();
  const [showSecondary, setShowSecondary] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const [createCustomer, { isLoading: isLoadingCreate }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isLoadingUpdate }] =
    useUpdateCustomerMutation();

  const isLoading = isLoadingCreate || isLoadingUpdate;
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (customerData?.data && !hasInitialized.current) {
      hasInitialized.current = true;
      const c = customerData.data;
      const hasSecondary = Boolean(c.secondaryEmail || c.secondaryPhone);
      setShowSecondary(hasSecondary);

      reset({
        firstName: c.firstName ?? "",
        lastName: c.lastName ?? "",
        email: c.email ?? "",
        phone: c.phone ?? "",
        customerType: c.customerType ?? "BUSINESS",
        language: c.language ?? "English",
        website: c.website ?? "",
        companyName: c.companyName ?? "",
        taxId: c.taxId ?? "",
        isTaxExempt: c.isTaxExempt ?? false,
        taxExemptNumber: c.taxExemptNumber ?? "",
        secondaryFirstName: "",
        secondaryLastName: "",
        secondaryEmail: c.secondaryEmail ?? "",
        secondaryPhone: c.secondaryPhone ?? "",
        street: c.street ?? "",
        city: c.city ?? "",
        state: c.state ?? "",
        postalCode: c.postalCode ?? "",
        country: c.country ?? "United States",
        tags: c.tags ?? [],
        notes: c.notes ?? "",
        eventType: c.eventType ?? "",
        eventDate: c.eventDate ? c.eventDate.slice(0, 10) : "",
        profileImage: c.profileImage ?? "",
      });
    }
  }, [customerData, reset]);

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

  const dataUrlToFile = (dataUrl: string, filename: string): File => {
    const [meta, base64] = dataUrl.split(",");
    const mimeMatch = meta.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new File([array], filename, { type: mime });
  };

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const formData = new FormData();

      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("customerType", data.customerType);
      if (data.language) formData.append("language", data.language);
      if (data.website) formData.append("website", data.website);
      if (data.companyName) formData.append("companyName", data.companyName);
      if (data.taxId) formData.append("taxId", data.taxId);
      if (data.isTaxExempt !== undefined) {
        formData.append("isTaxExempt", String(data.isTaxExempt));
      }
      if (data.taxExemptNumber) {
        formData.append("taxExemptNumber", data.taxExemptNumber);
      }

      if (showSecondary) {
        if (data.secondaryFirstName)
          formData.append("secondaryFirstName", data.secondaryFirstName);
        if (data.secondaryLastName)
          formData.append("secondaryLastName", data.secondaryLastName);
        if (data.secondaryEmail)
          formData.append("secondaryEmail", data.secondaryEmail);
        if (data.secondaryPhone)
          formData.append("secondaryPhone", data.secondaryPhone);
      }

      if (data.street) formData.append("street", data.street);
      if (data.city) formData.append("city", data.city);
      if (data.state) formData.append("state", data.state);
      if (data.postalCode) formData.append("postalCode", data.postalCode);
      if (data.country) formData.append("country", data.country);

      (data.tags || []).forEach((tag) => formData.append("tags[]", tag));

      if (data.notes) formData.append("notes", data.notes);
      if (data.eventType) formData.append("eventType", data.eventType);
      if (data.eventDate)
        formData.append("eventDate", new Date(data.eventDate).toISOString());

      if (data.profileImage && data.profileImage.startsWith("data:")) {
        const file = dataUrlToFile(data.profileImage, "profileImage.png");
        formData.append("profileImage", file);
      }

      if (isEditMode && id) {
        await updateCustomer({ id, data: formData }).unwrap();
      } else {
        await createCustomer(formData).unwrap();
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(
        isEditMode ? "Failed to update customer" : "Failed to create customer",
      );
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
        title={isEditMode ? "Edit Customer" : "Add New Customer"}
        description={
          isEditMode
            ? "Update this customer's profile"
            : "Create a new customer profile"
        }
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

          {customerType === "business" && (
            <CompanyInformation
              register={register}
              control={control}
              errors={errors}
              watch={watch}
            />
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
        </div>
      </div>
    </form>
  );
};

export default AddNewCustomer;
