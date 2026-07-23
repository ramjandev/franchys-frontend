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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const socialLinksSchema = z.object({
  facebook: z.string().trim(),
  instagram: z.string().trim(),
  tiktok: z.string().trim(),
  whatsapp: z.string().trim(),
});

type SocialLinksFormValues = z.infer<typeof socialLinksSchema>;

const SocialLinksSettings = () => {
  const { data, isLoading: isFetching } = useGetProfileShopQuery();
  const [updateProfileShop, { isLoading: isSaving }] =
    useUpdateProfileShopMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SocialLinksFormValues>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      facebook: "",
      instagram: "",
      tiktok: "",
      whatsapp: "",
    },
  });

  useEffect(() => {
    if (data?.data) {
      reset({
        facebook: data.data.facebook ?? "",
        instagram: data.data.instagram ?? "",
        tiktok: data.data.tiktok ?? "",
        whatsapp: data.data.whatsapp ?? "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: SocialLinksFormValues) => {
    const formData = new FormData();
    formData.append("facebook", values.facebook);
    formData.append("instagram", values.instagram);
    formData.append("tiktok", values.tiktok);
    formData.append("whatsapp", values.whatsapp);

    try {
      await updateProfileShop(formData).unwrap();
    } catch (err) {
      console.error("Failed to update social links", err);
    }
  };

  return (
    <div className="">
      <div className="pb-6">
        <CommonHeader size="2xl" className="font-medium!">
          Social Links
        </CommonHeader>
        <CommonHeader size="sm">
          Connect your social media profiles
        </CommonHeader>
      </div>

      {isFetching ? (
        <FormLoading fields={4} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" space-y-4">
            <div className="">
              <label className={inputClass.label}>Facebook</label>
              <input
                placeholder="https://facebook.com/yourpage"
                className={inputClass.input}
                {...register("facebook")}
              />
              {errors.facebook && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.facebook.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={inputClass.label}>Instagram</label>
              <input
                placeholder="https://instagram.com/yourprofile"
                className={inputClass.input}
                {...register("instagram")}
              />
              {errors.instagram && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.instagram.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={inputClass.label}>Tiktok</label>
              <input className={inputClass.input} {...register("tiktok")} />
              {errors.tiktok && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.tiktok.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={inputClass.label}>Whatsapp</label>
              <input
                placeholder="https://youtube.com/@yourchannel"
                className={inputClass.input}
                {...register("whatsapp")}
              />
              {errors.whatsapp && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border">
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

export default SocialLinksSettings;
