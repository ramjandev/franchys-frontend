import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import CommonSelect from "@/components/shared/CommonSelect";
import { inputClass } from "@/pages/Login";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { clearMockups, setSelectedProduct } from "@/store/imageSlice/imageSlice";

import CustomerSearchSelect from "./CustomerSearchSelect";
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
  const { data: sizesData } = useGetSelectedSizesQuery();

  // Dynamic sizes state
  const [activeSizes, setActiveSizes] = useState<string[]>([]);

  // Sync backend default sizes into activeSizes
  useEffect(() => {
    if (sizesData?.data && sizesData.data.length > 0) {
      setActiveSizes((prev) => {
        const set = new Set([...prev, ...sizesData.data]);
        return Array.from(set);
      });
    }
  }, [sizesData]);

  const { id: quoteId } = useParams<{ id?: string }>();
  const isEditMode = Boolean(quoteId);
  const dispatch = useDispatch();

  // Reset any cached mockups or selected product when opening a new quote
  useEffect(() => {
    if (!isEditMode) {
      dispatch(clearMockups());
      dispatch(setSelectedProduct(null));
    }
  }, [isEditMode, dispatch]);

  const repId = user?.userId ?? "";

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

  // Backfill sizes initially once when loaded
  const hasBackfilledRef = useRef(false);
  useEffect(() => {
    if (hasBackfilledRef.current || activeSizes.length === 0) return;
    const currentGroups = watch("groups");
    const needsBackfill = currentGroups.every((g) =>
      g.lineItems.every((li) => Object.keys(li.sizes).length === 0),
    );
    if (needsBackfill) {
      hasBackfilledRef.current = true;
      reset({
        ...watch(),
        groups: currentGroups.map((g) => ({
          ...g,
          lineItems: g.lineItems.map((li) => ({
            ...li,
            sizes: Object.fromEntries(
              activeSizes.map((s) => [s, li.sizes[s] ?? 0]),
            ),
          })),
        })),
      });
    }
  }, [activeSizes]);

  // Load existing quote data
  useEffect(() => {
    if (quoteData?.data) {
      const q = quoteData.data;

      // Collect any sizes present in quote line items
      const existingSizes: string[] = [];
      q.groups.forEach((g) => {
        g.lineItems.forEach((li) => {
          if (li.sizeBreakdown) {
            Object.keys(li.sizeBreakdown).forEach((sz) => {
              if (sz && !existingSizes.includes(sz)) {
                existingSizes.push(sz);
              }
            });
          }
        });
      });
      if (existingSizes.length > 0) {
        setActiveSizes((prev) =>
          Array.from(new Set([...prev, ...existingSizes])),
        );
      }

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
          priceMatrixColumn: g.lineItems[0]?.matrixColumn ?? "",
          imprintDetails: g.lineItems[0]?.imprintType ?? "",
          imprints: g.lineItems[0]?.matrixId
            ? [
                {
                  matrixId: g.lineItems[0].matrixId,
                  matrixColumn: g.lineItems[0].matrixColumn ?? "",
                  details: g.lineItems[0].imprintType ?? "",
                },
              ]
            : [],
          lineItems: g.lineItems.map((li) => ({
            category: li.category,
            itemNumber: li.itemNumber,
            color: li.color,
            description: li.description,
            imprintType: li.imprintType,
            sizes: li.sizeBreakdown || {},
            items: li.itemsCount,
            markup: Number(li.markupPrice) || 0,
            baseCost: Number(li.baseCost) || Number(li.unitPrice) || 0,
            price: Number(li.unitPrice) || 0,
            taxed: li.isTaxed,
            mockups: li.mockups || [],
            productId:
              (li as any).productId ||
              (li as any).product?.id ||
              (li as any).product?.productId ||
              "",
            matrixId: li.matrixId || "",
            matrixColumn: li.matrixColumn || "",
            printCost: Number(li.printCost) || 0,
            total: Number(li.total) || 0,
          })),
        })),
      });
    }
  }, [quoteData]);

  // Handlers for adding and removing sizes (stable without resetting group field IDs)
  const handleAddSize = (newSize: string) => {
    const trimmed = newSize.trim();
    if (!trimmed || activeSizes.includes(trimmed)) return;
    setActiveSizes((prev) => [...prev, trimmed]);
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setActiveSizes((prev) => prev.filter((s) => s !== sizeToRemove));

    const currentGroups = watch("groups") || [];
    currentGroups.forEach((g, gIdx) => {
      g.lineItems.forEach((li, liIdx) => {
        if (li.sizes && li.sizes[sizeToRemove]) {
          const removedQty = Number(li.sizes[sizeToRemove]) || 0;
          setValue(
            `groups.${gIdx}.lineItems.${liIdx}.sizes.${sizeToRemove}`,
            0,
          );
          const currentItems = Number(li.items) || 0;
          setValue(
            `groups.${gIdx}.lineItems.${liIdx}.items`,
            Math.max(0, currentItems - removedQty),
          );
        }
      });
    });
  };

  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({ control, name: "groups" });

  const handleAddGroup = () => {
    appendGroup(makeDefaultGroup(activeSizes, groupFields.length + 1));
  };

  const watchedGroups = watch("groups");
  const watchedDiscount = watch("discount");

  const { subtotal, discountAmount, total } = useMemo(() => {
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
        const lineTotal =
          li.total !== undefined && li.total > 0
            ? li.total
            : Number((li.items * li.price * (1 + li.markup / 100)).toFixed(2));
        const effectiveBaseCost =
          li.baseCost && li.baseCost > 0 ? li.baseCost : li.price;

        return {
          groupName: g.name,
          category: li.category,
          itemNumber: li.itemNumber,
          color: li.color,
          description: li.description,
          baseCost: effectiveBaseCost,
          sizeBreakdown: li.sizes,
          markupPrice: li.markup,
          matrixId: li.matrixId || g.priceMatrixId || undefined,
          matrixColumn: li.matrixColumn || g.priceMatrixColumn || undefined,
          printCost: li.printCost ?? 0,
          unitPrice: li.price,
          isTaxed: li.taxed,
          total: lineTotal,
          imprintType: li.imprintType || "",
          mockups: li.mockups || [],
        };
      }),
    }));

  const [recalculatedPricing, setRecalculatedPricing] =
    useState<RefreshPricingResult | null>(null);
  const isRefreshingPricingRef = useRef(false);
  const [updateRefreshPricing] = useRefreshPricingNewMutation();
  const [updateRefreshPricingExisting] = useRefreshPricingExistingMutation();

  // Clear stale recalculated pricing if user manually modifies form fields
  useEffect(() => {
    if (!isRefreshingPricingRef.current && recalculatedPricing) {
      setRecalculatedPricing(null);
    }
  }, [watchedGroups, watchedDiscount]);

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

      const serverCalcSubtotal =
        Number(result.subtotal) > 0 ? Number(result.subtotal) : subtotal;
      const serverCalcDiscount =
        Number(result.discount) >= 0 && (values.discount || 0) > 0
          ? Number(result.discount)
          : discountAmount;

      // Calculate tax only on items that are checked as taxed
      let currentTaxable = 0;
      values.groups.forEach((g, groupIdx) => {
        g.lineItems.forEach((li, lineItemIdx) => {
          if (li.taxed) {
            const serverLineTotal = Number(
              result.groups?.[groupIdx]?.lineItems?.[lineItemIdx]?.total,
            );
            const lineTotal =
              !isNaN(serverLineTotal) && serverLineTotal > 0
                ? serverLineTotal
                : li.total !== undefined && Number(li.total) > 0
                  ? Number(li.total)
                  : (li.items || 0) *
                    (li.price || 0) *
                    (1 + (li.markup || 0) / 100);
            currentTaxable += lineTotal;
          }
        });
      });

      const serverCalcTax =
        currentTaxable > 0
          ? Number((currentTaxable * (FIXED_TAX_RATE / 100)).toFixed(2))
          : 0;

      const updatedResult: RefreshPricingResult = {
        ...result,
        taxAmount: serverCalcTax.toFixed(2),
        total: Math.max(
          0,
          serverCalcSubtotal - serverCalcDiscount + serverCalcTax,
        ).toFixed(2),
      };

      isRefreshingPricingRef.current = true;
      setRecalculatedPricing(updatedResult);

      // Apply server-recalculated unitPrice, markup, total, printCost, and matrix fields
      updatedResult.groups.forEach((g, groupIdx) => {
        g.lineItems.forEach((li, lineItemIdx) => {
          setValue(
            `groups.${groupIdx}.lineItems.${lineItemIdx}.price`,
            Number(li.unitPrice),
            { shouldDirty: true },
          );
          setValue(
            `groups.${groupIdx}.lineItems.${lineItemIdx}.markup`,
            Number(li.markupPrice),
            { shouldDirty: true },
          );
          setValue(
            `groups.${groupIdx}.lineItems.${lineItemIdx}.total`,
            Number(li.total),
            { shouldDirty: true },
          );
          if (li.printCost !== undefined && li.printCost !== null) {
            setValue(
              `groups.${groupIdx}.lineItems.${lineItemIdx}.printCost`,
              Number(li.printCost),
              { shouldDirty: true },
            );
          }
          if (li.matrixId) {
            setValue(
              `groups.${groupIdx}.lineItems.${lineItemIdx}.matrixId`,
              li.matrixId,
              { shouldDirty: true },
            );
          }
          if (li.matrixColumn) {
            setValue(
              `groups.${groupIdx}.lineItems.${lineItemIdx}.matrixColumn`,
              li.matrixColumn,
              { shouldDirty: true },
            );
          }
        });
      });

      setTimeout(() => {
        isRefreshingPricingRef.current = false;
      }, 250);

      toast.success("Pricing refreshed successfully!");
    } catch (error: any) {
      console.error("Failed to refresh pricing", error);
      const errMsg =
        error?.data?.message ||
        error?.message ||
        "Failed to refresh pricing. Check connection.";
      toast.error(errMsg);
    }
  };

  const navigate = useNavigate();

  const executeSave = async (
    values: QuoteFormValues,
  ): Promise<string | undefined> => {
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
            : li.total && li.total > 0
              ? li.total
              : Number(lineTotal.toFixed(2));
          const effectiveBaseCost =
            li.baseCost && li.baseCost > 0 ? li.baseCost : li.price;

          return {
            groupName: g.name,
            category: li.category,
            itemNumber: li.itemNumber,
            color: li.color,
            description: li.description,
            baseCost: effectiveBaseCost,
            sizeBreakdown: li.sizes,
            markupPrice: li.markup,
            matrixId: li.matrixId || g.priceMatrixId || undefined,
            matrixColumn: li.matrixColumn || g.priceMatrixColumn || undefined,
            printCost:
              li.printCost ??
              (recalculatedLineItem
                ? Number(recalculatedLineItem.printCost)
                : 0),
            unitPrice,
            isTaxed: li.taxed,
            total: lineItemTotal,
            imprintType: li.imprintType || "",
            mockups: li.mockups || [],
          };
        }),
      })),
    };

    if (isEditMode && quoteId) {
      await updateQuote({ id: quoteId, data: payload }).unwrap();
      dispatch(clearMockups());
      dispatch(setSelectedProduct(null));
      return quoteId;
    } else {
      const res = await createQuote(payload).unwrap();
      dispatch(clearMockups());
      dispatch(setSelectedProduct(null));
      return res.data.id;
    }
  };

  const onSubmit = async (values: QuoteFormValues) => {
    try {
      await executeSave(values);
      toast.success(
        isEditMode
          ? "Quote updated successfully!"
          : "Quote created successfully!",
      );
      navigate("/admin/quotes");
    } catch (err) {
      console.error("Failed to save quote", err);
      toast.error("Failed to save quote. Please check required fields.");
    }
  };

  const [isSavingAndContinuing, setIsSavingAndContinuing] = useState(false);

  const handleSaveAndContinue = async () => {
    handleSubmit(async (values) => {
      try {
        setIsSavingAndContinuing(true);
        const savedId = await executeSave(values);
        toast.success("Quote saved! You can continue editing.");
        if (!isEditMode && savedId) {
          navigate(`/admin/quotes/edit/${savedId}`, { replace: true });
        }
      } catch (err) {
        console.error("Failed to save and continue", err);
        toast.error("Failed to save quote. Please check required fields.");
      } finally {
        setIsSavingAndContinuing(false);
      }
    })();
  };

  const isSaving = isCreating || isUpdatingQuote;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <CustomerSearchSelect
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
        {(() => {
          // Calculate taxable subtotal strictly from line items where taxed is checked
          let taxableSubtotal = 0;
          watchedGroups.forEach((g, groupIdx) => {
            g.lineItems.forEach((li, lineItemIdx) => {
              if (li.taxed) {
                const recalculatedLineItem =
                  recalculatedPricing?.groups?.[groupIdx]?.lineItems?.[lineItemIdx];
                const serverLineTotal = Number(recalculatedLineItem?.total);
                const lineTotal =
                  !isNaN(serverLineTotal) && serverLineTotal > 0
                    ? serverLineTotal
                    : li.total !== undefined && Number(li.total) > 0
                      ? Number(li.total)
                      : (li.items || 0) *
                        (li.price || 0) *
                        (1 + (li.markup || 0) / 100);
                taxableSubtotal += lineTotal;
              }
            });
          });

          const effectiveSubtotal =
            recalculatedPricing && Number(recalculatedPricing.subtotal) > 0
              ? Number(recalculatedPricing.subtotal)
              : subtotal;

          const effectiveDiscount =
            (watchedDiscount || 0) > 0
              ? (recalculatedPricing && Number(recalculatedPricing.discount) > 0
                  ? Number(recalculatedPricing.discount)
                  : discountAmount)
              : 0;

          // Tax is ONLY added when item(s) have 'Taxed' checked, otherwise $0.00
          const effectiveTax =
            taxableSubtotal > 0
              ? Number((taxableSubtotal * (FIXED_TAX_RATE / 100)).toFixed(2))
              : 0;

          // Total always accurately adds the tax value when taxed, and does not when untaxed
          const effectiveTotal = Math.max(
            0,
            Number((effectiveSubtotal - effectiveDiscount + effectiveTax).toFixed(2)),
          );

          return (
            <SummaryCard
              register={register}
              subtotal={effectiveSubtotal}
              discountAmount={effectiveDiscount}
              taxAmount={effectiveTax}
              taxRate={FIXED_TAX_RATE}
              total={effectiveTotal}
              onSaveDraft={handleSubmit(onSubmit)}
              onSaveAndContinue={handleSaveAndContinue}
              isSaving={isSaving}
              isSavingAndContinuing={isSavingAndContinuing}
              isEditMode={isEditMode}
            />
          );
        })()}
      </div>

      {groupFields.map((field, groupIndex) => (
        <LineItemsGroup
          key={field.id}
          groupIndex={groupIndex}
          sizes={activeSizes}
          onAddSize={handleAddSize}
          onRemoveSize={handleRemoveSize}
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
