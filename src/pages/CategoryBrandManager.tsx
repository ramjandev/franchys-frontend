import AddBrandModal from "@/components/admin/product/brand/AddBrandModal";
import AddCategoryModal from "@/components/admin/product/category/AddCategoryModal";
import EntityCard from "@/components/admin/product/EntityCard";
import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import DashboardCardSkeleton from "@/components/shared/loading/DashboardCardSkeleton";
import CommonTabs, { TabItem } from "@/components/transaction/CommonTabs";
import { loadingArray } from "@/lib/utils";
import {
  useDeleteBrandMutation,
  useDeleteCategoryMutation,
  useGetBrandsQuery,
  useGetCategoriesQuery,
} from "@/store/brandCategory/brandCategoryApi";
import {
  Brand,
  Category,
} from "@/store/brandCategory/types/brandCategoryTypes";

import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { LuLayoutGrid, LuTag } from "react-icons/lu";

type EntityTab = "category" | "brand";

const TABS: readonly TabItem<EntityTab>[] = [
  { label: "Categories", value: "category" },
  { label: "Brands", value: "brand" },
];

const CategoryBrandManager = () => {
  const [activeTab, setActiveTab] = useState<EntityTab>("category");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>();

  const { data: categoryData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({ page: 1, limit: 100 });
  const { data: brandData, isLoading: isBrandsLoading } = useGetBrandsQuery({
    page: 1,
    limit: 100,
  });

  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const categories = categoryData?.data ?? [];
  const brands = brandData?.data ?? [];

  const openAddCategory = () => {
    setEditingCategory(undefined);
    setShowCategoryModal(true);
  };
  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setShowCategoryModal(true);
  };
  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  const openAddBrand = () => {
    setEditingBrand(undefined);
    setShowBrandModal(true);
  };
  const openEditBrand = (b: Brand) => {
    setEditingBrand(b);
    setShowBrandModal(true);
  };
  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteBrand(id).unwrap();
    } catch (err) {
      console.error("Failed to delete brand", err);
    }
  };

  return (
    <div className="flex flex-col">
      <DashboardTopSection
        title="Categories & Brands"
        description="Organize your catalog with categories and brands."
        buttonOne={activeTab === "category" ? "New Category" : "New Brand"}
        actionOne={activeTab === "category" ? openAddCategory : openAddBrand}
      />

      <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm !p-0 overflow-hidden">
        <CommonTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-6">
          {activeTab === "category" && (
            <>
              {isCategoriesLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {loadingArray(4).map((_, i) => (
                    <DashboardCardSkeleton key={i} />
                  ))}
                </div>
              )}
              {!isCategoriesLoading && categories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <LuLayoutGrid className="text-3xl text-[#CBD5E1] mb-2" />
                  <p className="text-sm text-[#62748E]">
                    No categories yet. Create your first one.
                  </p>
                  <CommonButton className="mt-4" onClick={openAddCategory}>
                    <GoPlusCircle /> New Category
                  </CommonButton>
                </div>
              )}
              {!isCategoriesLoading && categories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categories.map((c) => (
                    <EntityCard
                      key={c.id}
                      icon={<LuLayoutGrid />}
                      name={c.name}
                      description={c.description}
                      createdAt={c.createdAt}
                      onEdit={() => openEditCategory(c)}
                      onDelete={() => handleDeleteCategory(c.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "brand" && (
            <>
              {isBrandsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {loadingArray(4).map((_, i) => (
                    <DashboardCardSkeleton key={i} />
                  ))}
                </div>
              )}
              {!isBrandsLoading && brands.length === 0 && (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <LuTag className="text-3xl text-[#CBD5E1] mb-2" />
                  <p className="text-sm text-[#62748E]">
                    No brands yet. Create your first one.
                  </p>
                  <CommonButton className="mt-4" onClick={openAddBrand}>
                    <GoPlusCircle /> New Brand
                  </CommonButton>
                </div>
              )}
              {!isBrandsLoading && brands.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {brands.map((b) => (
                    <EntityCard
                      key={b.id}
                      icon={<LuTag />}
                      name={b.name}
                      description={b.description}
                      createdAt={b.createdAt}
                      onEdit={() => openEditBrand(b)}
                      onDelete={() => handleDeleteBrand(b.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </CardContainer>

      {showCategoryModal && (
        <AddCategoryModal
          close={() => setShowCategoryModal(false)}
          selectedCategory={editingCategory}
        />
      )}
      {showBrandModal && (
        <AddBrandModal
          close={() => setShowBrandModal(false)}
          selectedBrand={editingBrand}
        />
      )}
    </div>
  );
};

export default CategoryBrandManager;
