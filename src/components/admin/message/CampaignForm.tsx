import CommonButton from "@/components/shared/CommonButton";
import { inputClass } from "@/pages/Admin/MockupBuilder/components/LeftPanel";
import { useCreateCampaignMutation } from "@/store/campaign/campaignAPI";
import { CampaignType as ApiCampaignType } from "@/store/campaign/types/campaignTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoIosSend, IoIosTrendingUp } from "react-icons/io";
import { MdOutlineDiscount, MdOutlineMailOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import DiscountFields from "./DiscountFields";
import { PRODUCTS, type Campaign, type CampaignType } from "./MessageData";
import NewsletterFields from "./NewsletterFields";
import ProductCatalog from "./ProductCatalog";
import PromotionFields from "./PromotionFields";

interface CampaignFormProps {
  initialData?: Campaign;
  mode?: "create" | "edit";
}

// local UI type ("Newsletter" | "Promotion" | "Discount") -> API enum
const TYPE_TO_API: Record<CampaignType, ApiCampaignType> = {
  Newsletter: "NEWSLETTER",
  Promotion: "PROMOTION",
  Discount: "DISCOUNT",
};

// ---- schema: all fields present, required-ness depends on campaign type ----

const campaignFormSchema = z
  .object({
    type: z.enum(["Newsletter", "Promotion", "Discount"]),
    title: z.string().min(1, "Campaign title is required"),
    audience: z.string().min(1, "Target audience is required"),

    // Newsletter
    subject: z.string(),
    content: z.string(),

    // Promotion
    promoCode: z.string(),
    promoDiscountType: z.string(),
    promoPercentage: z.string(),
    promoMinOrder: z.string(),
    promoStartDate: z.string(),
    promoEndDate: z.string(),
    promoTerms: z.string(),

    // Discount
    discountCode: z.string(),
    discDiscountType: z.string(),
    discPercentage: z.string(),
    discAppliesTo: z.string(),
    discMinOrder: z.string(),
    discExpiry: z.string(),
    discUsageLimit: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.type === "Newsletter") {
      if (!values.subject.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Subject is required",
          path: ["subject"],
        });
      }
      if (!values.content.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Content is required",
          path: ["content"],
        });
      }
    }

    if (values.type === "Promotion") {
      if (!values.promoCode.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Promo code is required",
          path: ["promoCode"],
        });
      }
      if (!values.promoPercentage.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Percentage is required",
          path: ["promoPercentage"],
        });
      }
      if (!values.promoStartDate.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start date is required",
          path: ["promoStartDate"],
        });
      }
      if (!values.promoEndDate.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date is required",
          path: ["promoEndDate"],
        });
      }
    }

    if (values.type === "Discount") {
      if (!values.discountCode.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount code is required",
          path: ["discountCode"],
        });
      }
      if (!values.discPercentage.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Percentage is required",
          path: ["discPercentage"],
        });
      }
      if (!values.discExpiry.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Expiry date is required",
          path: ["discExpiry"],
        });
      }
    }
  });

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

const CampaignForm: React.FC<CampaignFormProps> = ({ initialData, mode }) => {
  const navigate = useNavigate();
  const [createCampaign, { isLoading: isSaving }] = useCreateCampaignMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      type: initialData?.type ?? "Newsletter",
      title: initialData?.title ?? "",
      audience: initialData?.audience ?? "",
      subject: initialData?.subject ?? "",
      content: initialData?.content ?? "",
      promoCode: "",
      promoDiscountType: "",
      promoPercentage: "",
      promoMinOrder: "",
      promoStartDate: "",
      promoEndDate: "",
      promoTerms: "",
      discountCode: "",
      discDiscountType: "",
      discPercentage: "",
      discAppliesTo: "",
      discMinOrder: "",
      discExpiry: "",
      discUsageLimit: "",
    },
  });

  const type = watch("type");

  const selProdsKey = "selectedProductIds";
  const selProds = (watch as any)(selProdsKey) as number[] | undefined;
  const currentSelProds =
    selProds ?? initialData?.products.map((p) => p.id) ?? [];

  const toggleProd = (id: number) => {
    const next = currentSelProds.includes(id)
      ? currentSelProds.filter((x) => x !== id)
      : [...currentSelProds, id];
    setValue(selProdsKey as any, next as any);
  };

  const TYPES: { key: CampaignType; icon: React.ReactNode }[] = [
    { key: "Newsletter", icon: <MdOutlineMailOutline className="text-xl" /> },
    { key: "Promotion", icon: <IoIosTrendingUp className="text-xl" /> },
    { key: "Discount", icon: <MdOutlineDiscount className="text-xl" /> },
  ];

  // adapter objects so the existing NewsletterFields/PromotionFields/
  // DiscountFields components (which expect { vals, set }) keep working
  // unchanged, backed by RHF state instead of local useState
  const nlVals = { subject: watch("subject"), content: watch("content") };
  const setNlVals = (updater: any) => {
    const next = typeof updater === "function" ? updater(nlVals) : updater;
    setValue("subject", next.subject);
    setValue("content", next.content);
  };

  const promoVals = {
    promoCode: watch("promoCode"),
    discountType: watch("promoDiscountType"),
    percentage: watch("promoPercentage"),
    minOrder: watch("promoMinOrder"),
    startDate: watch("promoStartDate"),
    endDate: watch("promoEndDate"),
    terms: watch("promoTerms"),
  };
  const setPromoVals = (updater: any) => {
    const next = typeof updater === "function" ? updater(promoVals) : updater;
    setValue("promoCode", next.promoCode);
    setValue("promoDiscountType", next.discountType);
    setValue("promoPercentage", next.percentage);
    setValue("promoMinOrder", next.minOrder);
    setValue("promoStartDate", next.startDate);
    setValue("promoEndDate", next.endDate);
    setValue("promoTerms", next.terms);
  };

  const discVals = {
    discountCode: watch("discountCode"),
    discountType: watch("discDiscountType"),
    percentage: watch("discPercentage"),
    appliesTo: watch("discAppliesTo"),
    minOrder: watch("discMinOrder"),
    expiry: watch("discExpiry"),
    usageLimit: watch("discUsageLimit"),
  };
  const setDiscVals = (updater: any) => {
    const next = typeof updater === "function" ? updater(discVals) : updater;
    setValue("discountCode", next.discountCode);
    setValue("discDiscountType", next.discountType);
    setValue("discPercentage", next.percentage);
    setValue("discAppliesTo", next.appliesTo);
    setValue("discMinOrder", next.minOrder);
    setValue("discExpiry", next.expiry);
    setValue("discUsageLimit", next.usageLimit);
  };

  const onSubmit = async (values: CampaignFormValues) => {
    const selectedProductIds = PRODUCTS.filter((p) =>
      currentSelProds.includes(p.id),
    ).map((p) => String(p.id));

    let payload;

    if (values.type === "Newsletter") {
      payload = {
        title: values.title,
        type: TYPE_TO_API[values.type],
        status: "DRAFT" as const,
        recipientsCount: 0,
        targetAudience: values.audience,
        promoCode: "",
        discountType: "percentage" as const,
        percentage: "0",
        minOrderAmount: "0",
        usageLimit: 0,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        termsCondition: values.content,
        featuredProducts: selectedProductIds,
      };
    } else if (values.type === "Promotion") {
      payload = {
        title: values.title,
        type: TYPE_TO_API[values.type],
        status: "DRAFT" as const,
        recipientsCount: 0,
        targetAudience: values.audience,
        promoCode: values.promoCode,
        discountType: (values.promoDiscountType || "percentage") as
          | "percentage"
          | "fixed",
        percentage: values.promoPercentage,
        minOrderAmount: values.promoMinOrder,
        usageLimit: 0,
        startDate: values.promoStartDate
          ? new Date(values.promoStartDate).toISOString()
          : new Date().toISOString(),
        endDate: values.promoEndDate
          ? new Date(values.promoEndDate).toISOString()
          : new Date().toISOString(),
        termsCondition: values.promoTerms,
        featuredProducts: selectedProductIds,
      };
    } else {
      payload = {
        title: values.title,
        type: TYPE_TO_API[values.type],
        status: "DRAFT" as const,
        recipientsCount: 0,
        targetAudience: values.audience,
        promoCode: values.discountCode,
        discountType: (values.discDiscountType || "percentage") as
          | "percentage"
          | "fixed",
        percentage: values.discPercentage,
        minOrderAmount: values.discMinOrder,
        usageLimit: Number(values.discUsageLimit) || 0,
        startDate: new Date().toISOString(),
        endDate: values.discExpiry
          ? new Date(values.discExpiry).toISOString()
          : new Date().toISOString(),
        termsCondition: values.discAppliesTo,
        featuredProducts: selectedProductIds,
      };
    }

    try {
      await createCampaign(payload).unwrap();
      navigate("../campaigns");
    } catch (err) {
      console.error("Failed to create campaign", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-start gap-4 flex-1 min-h-0 overflow-hidden"
    >
      {/* Left form */}
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm overflow-y-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-extrabold text-slate-800 m-0">
            {mode === "create" ? "Create New Campaign" : "Edit Campaign"}
          </h2>
          <Link to="../campaigns">
            <button
              type="button"
              className="text-xl text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer leading-none"
            >
              ✕
            </button>
          </Link>
        </div>

        {/* Campaign type */}
        <div>
          <label className={inputClass.label}>Campaign Type</label>
          <div className="grid grid-cols-3 gap-3">
            {TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setValue("type", t.key)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-4 text-sm font-medium transition-all cursor-pointer ${
                  type === t.key
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                <span className="text-xl">{t.icon}</span>
                {t.key}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign title */}
        <div>
          <label className={inputClass.label}>Campaign Title</label>
          <input
            placeholder="Enter campaign title..."
            className={inputClass.input}
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-[#E7000B] mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Type-specific fields */}
        {type === "Newsletter" && (
          <NewsletterFields vals={nlVals} set={setNlVals} />
        )}
        {type === "Promotion" && (
          <PromotionFields vals={promoVals} set={setPromoVals} />
        )}
        {type === "Discount" && (
          <DiscountFields vals={discVals} set={setDiscVals} />
        )}

        {/* Target audience */}
        <div>
          <label className={inputClass.label}>Target Audience</label>
          <input className={inputClass.input} {...register("audience")} />
          {errors.audience && (
            <p className="text-xs text-[#E7000B] mt-1">
              {errors.audience.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-auto pt-1">
          <CommonButton
            type="submit"
            variant="primaryBlue"
            className="flex-1 py-3"
            isLoading={isSaving}
            loadingText="Saving..."
          >
            <IoIosSend className="text-xl" /> Save Changes
          </CommonButton>

          <CommonButton type="button" variant="ghost" to="../campaigns">
            Cancel
          </CommonButton>
        </div>
      </div>
      <div className="w-125 shrink-0">
        <ProductCatalog selected={currentSelProds} onToggle={toggleProd} />
      </div>
    </form>
  );
};

export default CampaignForm;
