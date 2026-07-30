import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import CommonSelect from "@/components/shared/CommonSelect";
import { inputClass } from "@/pages/Login";
import { useGetAllCustomersQuery } from "@/store/Customer/customerAPI";
import {
  useCreateQuoteMutation,
  useGetQuoteByIdQuery,
  useRefreshPricingExistingMutation,
  useRefreshPricingNewMutation,
  useUpdateQuoteMutation,
} from "@/store/quote/quoteAPI";
import {
  CreateQuotePayload,
  QuoteGroupPayload,
  RefreshPricingExistingPayload,
  RefreshPricingNewPayload,
  RefreshPricingResult,
  UpdateQuotePayload,
} from "@/store/quote/types/quoteTypes";
import { useGetSelectedSizesQuery } from "@/store/settings/customLineItems/lineItemCustomizationAPI";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { resetSavedImages } from "@/store/mockUp/designSlice";
import LineItemsGroup from "./LineItemsGroup";
import SummaryCard from "./SummaryCard";
import { deliveryMethods } from "./data";
import {
  makeDefaultGroup,
  quoteFormSchema,
  QuoteFormValues,
} from "./schema/quoteFormSchema";

const FIXED_TAX_RATE = 7;

const CreateQuoteForm = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const { savedImages } = useSelector((s: RootState) => s.design);
  const { data: customersData } = useGetAllCustomersQuery({ limit: 100 });
  const { data: sizesData } = useGetSelectedSizesQuery();
  const sizes = sizesData?.data ?? [];

  const { id: quoteId } = useParams<{ id?: string }>();
  const isEditMode = Boolean(quoteId);

  const repId = user?.userId ?? "";
  const customerOptions =
    customersData?.data.map((customer) => ({
      label: `${customer.firstName} ${customer.lastName}`,
      value: customer.id,
    })) ?? [];

  const { data: quoteData } = useGetQuoteByIdQuery(quoteId!, {
    skip: !quoteId,
    refetchOnMountOrArgChange: true,
  });
  const [createQuote, { isLoading: isCreating }] = useCreateQuoteMutation();
  const [updateQuote, { isLoading: isUpdatingQuote }] =
    useUpdateQuoteMutation();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      customerId: "",
      repId,
      poNumber: "",
      deliveryMethod: "",
      dueDate: "",
      notes: "",
      discount: 0,
      taxRate: FIXED_TAX_RATE,
      groups: [makeDefaultGroup([], 1)],
    },
  });

  useEffect(() => {
    if (repId) setValue("repId", repId);
  }, [repId, setValue]);

  useEffect(() => {
    if (sizes.length === 0) return;
    const currentGroups = watch("groups");
    const needsBackfill = currentGroups.every((g) =>
      g.lineItems.every((li) => Object.keys(li.sizes).length === 0),
    );
    if (needsBackfill) {
      reset({
        ...watch(),
        groups: currentGroups.map((g) => ({
          ...g,
          lineItems: g.lineItems.map((li) => ({
            ...li,
            sizes: Object.fromEntries(sizes.map((s) => [s, li.sizes[s] ?? 0])),
          })),
        })),
      });
    }
  }, [sizes.join(",")]);

  useEffect(() => {
    if (quoteData?.data) {
      const q = quoteData.data;
      reset({
        customerId: q.customerId,
        repId: q.repId || repId,
        poNumber: q.poNumber ?? "",
        deliveryMethod: q.deliveryMethod ?? "",
        dueDate: q.dueDate ? q.dueDate.slice(0, 10) : "",
        notes: q.notes ?? "",
        discount: Number(q.discount) || 0,
        taxRate: Number(q.taxRate) || FIXED_TAX_RATE,
        groups: q.groups.map((g) => ({
          name: g.name,
          priceMatrixId: g.lineItems[0]?.matrixId ?? "",
          lineItems: g.lineItems.map((li) => ({
            category: li.category,
            itemNumber: li.itemNumber,
            color: li.color,
            description: li.description,
            imprintType: li.imprintType,
            sizes: li.sizeBreakdown,
            items: li.itemsCount,
            markup: Number(li.markupPrice) ?? "",
            price: Number(li.unitPrice) || 0,
            taxed: li.isTaxed,
          })),
        })),
      });
    }
  }, [quoteData]);

  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({ control, name: "groups" });

  const dispatch = useDispatch();
  const handleAddGroup = () => {
    appendGroup(makeDefaultGroup(sizes, groupFields.length + 1));
  };

  const watchedGroups = watch("groups");
  const watchedDiscount = watch("discount");

  const { subtotal, discountAmount, taxAmount, total } = useMemo(() => {
    let subtotalSum = 0;
    let taxableSum = 0;

    watchedGroups.forEach((g) => {
      g.lineItems.forEach((li) => {
        const lineTotal =
          (li.items || 0) * (li.price || 0) * (1 + (li.markup || 0) / 100);
        subtotalSum += lineTotal;
        if (li.taxed) {
          taxableSum += lineTotal;
        }
      });
    });

    const discountPct = watchedDiscount || 0;
    const discountAmt = subtotalSum * (discountPct / 100);
    const taxAmt = taxableSum * (FIXED_TAX_RATE / 100);
    const totalAmt = subtotalSum - discountAmt + taxAmt;

    return {
      subtotal: subtotalSum,
      discountAmount: discountAmt,
      taxAmount: taxAmt,
      total: totalAmt,
    };
  }, [watchedGroups, watchedDiscount]);

  const buildGroupsPayload = (
    groups: QuoteFormValues["groups"],
  ): QuoteGroupPayload[] =>
    groups.map((g) => ({
      name: g.name,
      lineItems: g.lineItems.map((li) => {
        const lineTotal = li.items * li.price * (1 + li.markup / 100);
        return {
          groupName: g.name,
          category: li.category,
          itemNumber: li.itemNumber,
          color: li.color,
          description: li.description,
          baseCost: li.price,
          sizeBreakdown: li.sizes,
          markupPrice: li.markup,
          matrixId: g.priceMatrixId || undefined,
          printCost: 0,
          unitPrice: li.price,
          isTaxed: li.taxed,
          total: Number(lineTotal.toFixed(2)),
          imprintType: li.imprintType,
          mockups: savedImages ?? [],
        };
      }),
    }));

  const [recalculatedPricing, setRecalculatedPricing] =
    useState<RefreshPricingResult | null>(null);
  const [updateRefreshPricing] = useRefreshPricingNewMutation();
  // need when quote is editing
  const [updateRefreshPricingExisting] = useRefreshPricingExistingMutation();

  const onRefreshPricing = async () => {
    try {
      const values = watch();
      const groupsPayload = buildGroupsPayload(values.groups);

      let result: RefreshPricingResult;

      if (quoteId) {
        const existingPayload: RefreshPricingExistingPayload = {
          customerId: values.customerId,
          repId: values.repId,
          poNumber: values.poNumber,
          deliveryMethod: values.deliveryMethod,
          dueDate: values.dueDate
            ? new Date(values.dueDate).toISOString()
            : new Date().toISOString(),
          status: "DRAFT",
          discount: values.discount,
          taxRate: FIXED_TAX_RATE,
          total: Number(total.toFixed(2)),
          notes: values.notes,
          groups: groupsPayload,
        };

        const res = await updateRefreshPricingExisting({
          id: quoteId,
          data: existingPayload,
        }).unwrap();
        result = res.data;
      } else {
        const newPayload: RefreshPricingNewPayload = {
          discount: values.discount,
          taxRate: FIXED_TAX_RATE,
          total: Number(total.toFixed(2)),
          groups: groupsPayload,
        };

        const res = await updateRefreshPricing(newPayload).unwrap();
        result = res.data;
      }

      setRecalculatedPricing(result);

      // sync recalculated price/markup back into form state so the
      // subtotal/tax/total useMemo recomputes and SummaryCard re-renders
      result.groups.forEach((g, groupIdx) => {
        g.lineItems.forEach((li, lineItemIdx) => {
          setValue(
            `groups.${groupIdx}.lineItems.${lineItemIdx}.price`,
            Number(li.unitPrice),
          );
          setValue(
            `groups.${groupIdx}.lineItems.${lineItemIdx}.markup`,
            Number(li.markupPrice),
          );
        });
      });
    } catch (error) {
      console.error("Failed to refresh pricing", error);
    }
  };
  const navigate = useNavigate();
  const onSubmit = async (values: QuoteFormValues) => {
    const payload: CreateQuotePayload | UpdateQuotePayload = {
      customerId: values.customerId,
      repId: values.repId,
      poNumber: values.poNumber,
      deliveryMethod: values.deliveryMethod,
      dueDate: values.dueDate
        ? new Date(values.dueDate).toISOString()
        : new Date().toISOString(),
      status: "DRAFT",
      discount: values.discount,
      taxRate: FIXED_TAX_RATE,
      total: recalculatedPricing
        ? Number(recalculatedPricing.total)
        : Number(total.toFixed(2)),
      notes: values.notes,
      groups: values.groups.map((g, groupIdx) => ({
        name: g.name,
        lineItems: g.lineItems.map((li, lineItemIdx) => {
          const lineTotal = li.items * li.price * (1 + li.markup / 100);

          const recalculatedLineItem =
            recalculatedPricing?.groups?.[groupIdx]?.lineItems?.[lineItemIdx];

          const unitPrice = recalculatedLineItem
            ? Number(recalculatedLineItem.unitPrice)
            : li.price;
          const lineItemTotal = recalculatedLineItem
            ? Number(recalculatedLineItem.total)
            : Number(lineTotal.toFixed(2));

          return {
            groupName: g.name,
            category: li.category,
            itemNumber: li.itemNumber,
            color: li.color,
            description: li.description,
            baseCost: li.price,
            sizeBreakdown: li.sizes,
            markupPrice: li.markup,
            matrixId: g.priceMatrixId || undefined,
            printCost: 0,
            unitPrice,
            isTaxed: li.taxed,
            total: lineItemTotal,
            imprintType: li.imprintType,
            mockups: savedImages ?? [],
          };
        }),
      })),
    };

    try {
      if (isEditMode && quoteId) {
        await updateQuote({ id: quoteId, data: payload }).unwrap();
      } else {
        await createQuote(payload).unwrap();
      }
      dispatch(resetSavedImages());
      navigate("/admin/quotes");
    } catch (err) {
      console.error("Failed to save quote", err);
    }
  };

  const isSaving = isCreating || isUpdatingQuote;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" space-y-6">
      <div className=" grid grid-cols-1 md:grid-cols-4 gap-6">
        <CardContainer size="lg" className="col-span-3">
          <div className="flex items-center justify-between mb-6">
            <CommonHeader size="lg">Customer Details</CommonHeader>

            <CommonButton variant="primaryBlue" to="../customers/new">
              <Plus /> Add Customer
            </CommonButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={inputClass.label}>
                Select Customer <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="customerId"
                render={({ field }) => (
                  <CommonSelect
                    item={customerOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select a customer"
                    className="w-full"
                  />
                )}
              />
              {errors.customerId && (
                <p className="text-xs text-red-500">
                  {errors.customerId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className={inputClass.label}>Delivery Method</label>
              <Controller
                control={control}
                name="deliveryMethod"
                render={({ field }) => (
                  <CommonSelect
                    item={deliveryMethods}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select delivery method"
                    className="w-full"
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <label className={inputClass.label}>PO Number</label>
              <input
                placeholder="Enter PO number"
                className={inputClass.input}
                {...register("poNumber")}
              />
            </div>
            <div className="space-y-2">
              <label className={inputClass.label}>Customer Due Date</label>
              <input
                type="date"
                className={inputClass.input}
                {...register("dueDate")}
              />
            </div>
          </div>
        </CardContainer>
        <SummaryCard
          register={register}
          subtotal={
            recalculatedPricing
              ? Number(recalculatedPricing.subtotal)
              : subtotal
          }
          discountAmount={
            recalculatedPricing
              ? Number(recalculatedPricing.subtotal) -
                Number(recalculatedPricing.total) +
                Number(recalculatedPricing.taxAmount)
              : discountAmount
          }
          taxAmount={
            recalculatedPricing
              ? Number(recalculatedPricing.taxAmount)
              : taxAmount
          }
          taxRate={FIXED_TAX_RATE}
          total={
            recalculatedPricing ? Number(recalculatedPricing.total) : total
          }
          onSaveDraft={handleSubmit(onSubmit)}
          isSaving={isSaving}
          isEditMode={isEditMode}
        />
      </div>

      {groupFields.map((field, groupIndex) => (
        <LineItemsGroup
          key={field.id}
          groupIndex={groupIndex}
          sizes={sizes}
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          onRemoveGroup={() => removeGroup(groupIndex)}
          canRemoveGroup={groupFields.length > 1}
          onRefreshPricing={onRefreshPricing}
        />
      ))}

      <CommonButton
        type="button"
        variant="primaryBlue"
        onClick={handleAddGroup}
      >
        <Plus /> Add Group
      </CommonButton>

      <CardContainer size="lg">
        <CommonHeader size="lg">Notes & Attachments</CommonHeader>
        <textarea
          className={`${inputClass.input} mt-2`}
          placeholder="Add terms, turnaround time, or special instructions..."
          {...register("notes")}
        />
      </CardContainer>
    </form>
  );
};

export default CreateQuoteForm;
