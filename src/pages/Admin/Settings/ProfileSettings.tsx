import AvatarUpload from "@/components/settings/AvatarUpload";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import FormLoading from "@/components/shared/loading/FormLoading";
import { inputClass } from "@/pages/Login";
import {
  useGetMeQuery,
  useUpdateUserProfileMutation,
} from "@/store/settings/profileInformation/profileShopAPI";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const designGrid = "grid sm:grid-cols-[180px_1fr] sm:gap-3 items-center";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  timezone: z.string().trim(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const dataUrlToFile = async (dataUrl: string, filename = "avatar.png") => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const ProfileSettings = () => {
  const { data, isLoading: isFetching } = useGetMeQuery();
  const [updateUserProfile, { isLoading: isSaving }] =
    useUpdateUserProfileMutation();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const hasInitialized = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      timezone: "",
    },
  });

  useEffect(() => {
    if (data?.data && !hasInitialized.current) {
      hasInitialized.current = true;
      reset({
        name: data.data.name ?? "",
        email: data.data.email ?? "",
        timezone: data.data.timezone ?? "",
      });
      setAvatarPreview(data.data.avatar ?? data.data.profileImage ?? null);
    }
  }, [data, reset]);

  const handleAvatarChange = (dataUrl: string | null) => {
    setAvatarPreview(dataUrl);
    setAvatarChanged(true);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    if (values.timezone) formData.append("timezone", values.timezone);

    if (avatarChanged) {
      if (avatarPreview) {
        const file = await dataUrlToFile(avatarPreview);
        formData.append("profileImage", file);
      } else {
        formData.append("profileImage", "");
      }
    }

    try {
      await updateUserProfile(formData).unwrap();
      setAvatarChanged(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="">
      <CommonHeader
        size="2xl"
        className="font-medium! border-b border-border mb-6 pb-3"
      >
        Personal Information
      </CommonHeader>

      {isFetching ? (
        <FormLoading fields={3} />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <AvatarUpload
            label="Avatar"
            value={avatarPreview}
            onChange={handleAvatarChange}
          />

          <div className={designGrid}>
            <label className={`${inputClass.label} sm:text-right`}>Name</label>
            <div>
              <input className={inputClass.input} {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className={designGrid}>
            <label className={` ${inputClass.label} sm:text-right`}>
              Email
            </label>
            <div>
              <input
                type="email"
                className={inputClass.input}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className={designGrid}>
            <label className={` ${inputClass.label} sm:text-right`}>
              Timezone
            </label>
            <input
              placeholder="Select timezone…"
              className={inputClass.input}
              {...register("timezone")}
            />
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

export default ProfileSettings;
