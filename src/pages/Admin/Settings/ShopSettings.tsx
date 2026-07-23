import AvatarUpload from "@/components/settings/AvatarUpload";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import FormLoading from "@/components/shared/loading/FormLoading";
import { inputClass } from "@/pages/Login";
import {
  useGetProfileShopQuery,
  useUpdateProfileShopMutation,
} from "@/store/settings/profileInformation/profileShopAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { designGrid } from "./ProfileSettings";

const shopSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  companyEmail: z
    .string()
    .trim()
    .min(1, "Company email is required")
    .email("Invalid email address"),
  address: z.string().trim(),
  city: z.string().trim(),
  state: z.string().trim(),
  zip: z.string().trim(),
  country: z.string().trim(),
  phone: z.string().trim(),
  website: z.string().trim(),
});

type ShopFormValues = z.infer<typeof shopSchema>;

const dataUrlToFile = async (dataUrl: string, filename = "logo.png") => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const ShopSettings = () => {
  const { data, isLoading: isFetching } = useGetProfileShopQuery();
  const [updateProfileShop, { isLoading: isSaving }] =
    useUpdateProfileShopMutation();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [logoChanged, setLogoChanged] = useState(false);

  const hasInitialized = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      companyName: "",
      companyEmail: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      website: "",
    },
  });

  useEffect(() => {
    if (data?.data && !hasInitialized.current) {
      hasInitialized.current = true;
      reset({
        companyName: data.data.companyName ?? "",
        companyEmail: data.data.companyEmail ?? "",
        address: data.data.address ?? "",
        city: data.data.city ?? "",
        state: data.data.state ?? "",
        zip: data.data.zip ?? "",
        country: data.data.country ?? "",
        phone: data.data.phone ?? "",
        website: data.data.website ?? "",
      });
      setLogoPreview(data.data.companyLogo ?? null);
    }
  }, [data, reset]);

  const handleLogoChange = (dataUrl: string | null) => {
    setLogoPreview(dataUrl);
    setLogoChanged(true); // user picked or removed — always mark dirty
  };

  const onSubmit = async (values: ShopFormValues) => {
    const formData = new FormData();
    formData.append("companyName", values.companyName);
    formData.append("companyEmail", values.companyEmail);
    formData.append("address", values.address);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("zip", values.zip);
    formData.append("country", values.country);
    formData.append("phone", values.phone);
    formData.append("website", values.website);

    if (logoChanged) {
      if (logoPreview) {
        const file = await dataUrlToFile(logoPreview);
        formData.append("companyLogo", file);
      } else {
        formData.append("companyLogo", "");
      }
    }

    try {
      await updateProfileShop(formData).unwrap();
      setLogoChanged(false);
    } catch (err) {
      console.error("Failed to update shop settings", err);
    }
  };

  return (
    <div className="">
      <CommonHeader
        size="2xl"
        className="font-medium! border-b border-border mb-6 pb-3"
      >
        Shop Information
      </CommonHeader>
      {isFetching ? (
        <FormLoading fields={9} />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <AvatarUpload
            label="Logo"
            hint="Recommended size for logos are 600px by 300px using jpg, gif, or png format"
            value={logoPreview}
            onChange={handleLogoChange}
          />

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Company Name
            </label>
            <div>
              <input
                className={inputClass.input}
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right pt-2`}>
              Company Email
            </label>
            <div>
              <input
                type="email"
                className={inputClass.input}
                {...register("companyEmail")}
              />
              <p className="text-xs text-[#62748E] mt-1.5">
                This is used when a customer replies to an invoice being emailed
                out.
              </p>
              {errors.companyEmail && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.companyEmail.message}
                </p>
              )}
            </div>
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Address
            </label>
            <input className={inputClass.input} {...register("address")} />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>City</label>
            <input className={inputClass.input} {...register("city")} />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>State</label>
            <input className={inputClass.input} {...register("state")} />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>Zip</label>
            <input className={inputClass.input} {...register("zip")} />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Country
            </label>
            <input className={inputClass.input} {...register("country")} />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>Phone</label>
            <input className={inputClass.input} {...register("phone")} />
          </div>

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>
              Your Website
            </label>
            <input className={inputClass.input} {...register("website")} />
          </div>

          <div className="pt-6 mt-6 border-t border-border!">
            <CommonButton
              type="submit"
              variant="primaryGreen"
              isLoading={isSaving}
              loadingText="Saving..."
            >
              <Save />
              Save changes
            </CommonButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default ShopSettings;
