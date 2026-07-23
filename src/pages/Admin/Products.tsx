import AddProductModal from "@/components/admin/product/AddProductModal";
import FiltersSection from "@/components/admin/product/FiltersSection";
import ProductCard from "@/components/admin/product/ProductCard";
import ProductDetailModal from "@/components/admin/product/ProductDetailModal";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import DashboardCardSkeleton from "@/components/shared/loading/DashboardCardSkeleton";
import EmptyState from "@/components/shared/loading/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { loadingArray } from "@/lib/utils";
import { useGetProductsQuery } from "@/store/Product/productAPI";
import { Product } from "@/store/Product/types/productTypes";
import { useState } from "react";

const Products = () => {
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [filters, setFilters] = useState({
    category: "All",
    brand: "All",
    color: "All",
    size: "All",
  });

  const { data, isLoading } = useGetProductsQuery({ page });
  const products = data?.data ?? [];

  const setFilter = (key: string, val: string) =>
    setFilters((f) => ({ ...f, [key]: val }));

  const filtered = products.filter((p) => {
    const matchCategory =
      filters.category === "All" || p.category.name === filters.category;
    const matchBrand =
      filters.brand === "All" || p.brand.name === filters.brand;
    const matchSize =
      filters.size === "All" || p.availableSizes.includes(filters.size);
    return matchCategory && matchBrand && matchSize;
  });

  const openCreate = () => {
    setEditingProduct(undefined);
    setShowAddModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setSelectedProduct(null);
    setShowAddModal(true);
  };

  return (
    <div className="flex flex-col gap-6 ">
      <DashboardTopSection
        title="Product Catalog"
        description="Browse and manage your product catalog"
        backButton
        buttonOne="Add Product"
        actionOne={openCreate}
      />

      <FiltersSection filters={filters} setFilter={setFilter} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          loadingArray(8).map((_, index) => (
            <DashboardCardSkeleton key={index} />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setSelectedProduct={setSelectedProduct}
            />
          ))
        ) : (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or search term."
          />
        )}
      </div>
      {!isLoading &&
        filtered.length > 0 &&
        (data?.meta?.totalPages ?? 1) > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={data?.meta?.totalPages ?? 1}
              onPageChange={setPage}
            />
          </div>
        )}

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          product={editingProduct}
        />
      )}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={() => openEdit(selectedProduct)}
        />
      )}
    </div>
  );
};

export default Products;
