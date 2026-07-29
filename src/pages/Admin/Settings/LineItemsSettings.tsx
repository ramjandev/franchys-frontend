import CheckboxField from "@/components/shared/CheckboxField";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import {
  useGetLineItemCustomizationQuery,
  useUpdateLineItemCustomizationMutation,
} from "@/store/settings/customLineItems/lineItemCustomizationAPI";
import { UpdateLineItemCustomizationPayload } from "@/store/settings/customLineItems/types/lineItemCustomizationTypes";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";

const defaultPayload: UpdateLineItemCustomizationPayload = {
  showQuantity: false,
  showItemNumber: false,
  showCategory: false,
  showDescription: false,
  showColor: false,
  showMarkup: false,
  showPrice: false,

  sizeAdultXS: false,
  sizeAdultS: false,
  sizeAdultM: false,
  sizeAdultL: false,
  sizeAdultXL: false,
  sizeAdult2XL: false,
  sizeAdult3XL: false,
  sizeAdult4XL: false,

  sizeYouthXS: false,
  sizeYouthS: false,
  sizeYouthM: false,
  sizeYouthL: false,
  sizeYouthXL: false,

  sizeToddler2T: false,
  sizeToddler3T: false,
  sizeToddler4T: false,
  sizeToddler5T: false,
  sizeToddler6T: false,

  sizeBabyNewborn: false,
  sizeBaby3Months: false,
  sizeBaby6Months: false,
  sizeBaby9Months: false,
  sizeBaby12Months: false,
  sizeBaby18Months: false,
  sizeBaby24Months: false,
};

const columnConfig: {
  key: keyof UpdateLineItemCustomizationPayload;
  label: string;
  desc: string;
}[] = [
  {
    key: "showQuantity",
    label: "Quantity",
    desc: "Number of items to be produced",
  },
  { key: "showItemNumber", label: "Item #", desc: "Product or item number" },
  {
    key: "showCategory",
    label: "Category dropdown",
    desc: "Organize items by category",
  },
  {
    key: "showDescription",
    label: "Description",
    desc: "Detailed product description",
  },
  { key: "showColor", label: "Color", desc: "Product color option" },
  {
    key: "showMarkup",
    label: "Markup %",
    desc: "Markup percentage for pricing",
  },
  { key: "showPrice", label: "Price", desc: "Unit price per item" },
];

const adultSizeConfig: {
  key: keyof UpdateLineItemCustomizationPayload;
  label: string;
}[] = [
  { key: "sizeAdultXS", label: "XS" },
  { key: "sizeAdultS", label: "S" },
  { key: "sizeAdultM", label: "M" },
  { key: "sizeAdultL", label: "L" },
  { key: "sizeAdultXL", label: "XL" },
  { key: "sizeAdult2XL", label: "2XL" },
  { key: "sizeAdult3XL", label: "3XL" },
  { key: "sizeAdult4XL", label: "4XL" },
];

const youthSizeConfig: {
  key: keyof UpdateLineItemCustomizationPayload;
  label: string;
}[] = [
  { key: "sizeYouthXS", label: "Youth XS" },
  { key: "sizeYouthS", label: "Youth S" },
  { key: "sizeYouthM", label: "Youth M" },
  { key: "sizeYouthL", label: "Youth L" },
  { key: "sizeYouthXL", label: "Youth XL" },
];

const toddlerSizeConfig: {
  key: keyof UpdateLineItemCustomizationPayload;
  label: string;
}[] = [
  { key: "sizeToddler2T", label: "2T" },
  { key: "sizeToddler3T", label: "3T" },
  { key: "sizeToddler4T", label: "4T" },
  { key: "sizeToddler5T", label: "5T" },
  { key: "sizeToddler6T", label: "6T" },
];

const babySizeConfig: {
  key: keyof UpdateLineItemCustomizationPayload;
  label: string;
}[] = [
  { key: "sizeBabyNewborn", label: "Newborn" },
  { key: "sizeBaby3Months", label: "3 Months" },
  { key: "sizeBaby6Months", label: "6 Months" },
  { key: "sizeBaby9Months", label: "9 Months" },
  { key: "sizeBaby12Months", label: "12 Months" },
  { key: "sizeBaby18Months", label: "18 Months" },
  { key: "sizeBaby24Months", label: "24 Months" },
];

const LineItemsSettings = () => {
  const { data } = useGetLineItemCustomizationQuery();
  const [updateLineItemCustomization, { isLoading: isSaving }] =
    useUpdateLineItemCustomizationMutation();

  const [values, setValues] =
    useState<UpdateLineItemCustomizationPayload>(defaultPayload);

  useEffect(() => {
    if (data?.data) {
      const { columns, sizingOptions } = data.data;

      const flattenSizes = (sizes: { key: string; selected: boolean }[]) =>
        Object.fromEntries(sizes.map((s) => [s.key, s.selected]));

      setValues({
        showQuantity: columns.quantity,
        showItemNumber: columns.itemNumber,
        showCategory: columns.category,
        showDescription: columns.description,
        showColor: columns.color,
        showMarkup: columns.markup,
        showPrice: columns.price,
        ...flattenSizes(sizingOptions.adultSizes),
        ...flattenSizes(sizingOptions.youthSizes),
        ...flattenSizes(sizingOptions.toddlerSizes),
        ...flattenSizes(sizingOptions.babyInfantSizes),
      } as UpdateLineItemCustomizationPayload);
    }
  }, [data]);

  const handleToggle = (
    key: keyof UpdateLineItemCustomizationPayload,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValues((prev) => ({ ...prev, [key]: e.target.checked }));
  };

  const handleSave = async () => {
    try {
      await updateLineItemCustomization(values).unwrap();
    } catch (err) {
      console.error("Failed to update line item customization", err);
    }
  };

  return (
    <div className="">
      <div className="mb-6 pb-4 border-b border-border">
        <CommonHeader size="2xl" className="font-medium! ">
          Customize Your Line Items
        </CommonHeader>
        <CommonHeader size="sm">
          Customize the default columns you would like to use in your line
          items. You will have the ability to customize line item columns on
          individual quotes/invoices as well.
        </CommonHeader>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-4 sm:space-y-6">
          <CommonHeader size="lg"> Default Line Item Columns</CommonHeader>

          <div className="space-y-4">
            {columnConfig.map((col) => (
              <div key={col.key}>
                <div className="text-sm font-semibold text-[#0F172B] transition-colors">
                  {col.label}
                </div>
                <div className="text-xs text-[#62748E] mt-0.5">{col.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="mb-4">
            <CommonHeader size="lg">Sizing Options</CommonHeader>
            <CommonHeader size="sm">
              Select the sizes you want available for your products:
            </CommonHeader>
          </div>

          <div className="space-y-4">
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#1447E6] uppercase tracking-wider mb-3">
                Adult Sizes
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {adultSizeConfig.map((size) => (
                  <CheckboxField
                    key={size.key}
                    label={size.label}
                    checked={values[size.key]}
                    onChange={(e) => handleToggle(size.key, e)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-[#ECFEFF] border border-[#A5F3FC] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#0891B2] uppercase tracking-wider mb-3">
                Youth Sizes
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {youthSizeConfig.map((size) => (
                  <CheckboxField
                    key={size.key}
                    label={size.label}
                    checked={values[size.key]}
                    onChange={(e) => handleToggle(size.key, e)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-3">
                Toddler Sizes
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {toddlerSizeConfig.map((size) => (
                  <CheckboxField
                    key={size.key}
                    label={size.label}
                    checked={values[size.key]}
                    onChange={(e) => handleToggle(size.key, e)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-[#FDF2F8] border border-[#F9A8D4] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#BE185D] uppercase tracking-wider mb-3">
                Baby / Infant Sizes
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {babySizeConfig.map((size) => (
                  <CheckboxField
                    key={size.key}
                    label={size.label}
                    checked={values[size.key]}
                    onChange={(e) => handleToggle(size.key, e)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-border">
        <CommonButton
          variant="primaryGreen"
          onClick={handleSave}
          isLoading={isSaving}
          loadingText="Saving..."
        >
          <Save />
          Save changes
        </CommonButton>
      </div>
    </div>
  );
};

export default LineItemsSettings;
