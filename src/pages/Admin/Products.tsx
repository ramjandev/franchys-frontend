import AddProductModal from "@/components/admin/product/AddProductModal";
import FiltersSection from "@/components/admin/product/FiltersSection";
import ProductCard from "@/components/admin/product/ProductCard";
import ProductDetailModal from "@/components/admin/product/ProductDetailModal";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import Pagination from "@/components/shared/Pagination";
import { Search } from "lucide-react";
import { useState } from "react";

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: string;
  colors: string;
  sizes: string[];
  material: string;
  weight: string;
  style: string;
  description: string;
  availableColors: string[];
  imageUrl: string;
}

export interface NewProductForm {
  itemNumber: string;
  productName: string;
  brand: string;
  category: string;
  price: string;
  colors: string;
  imageFile: File | null;
  imagePreview: string;
}

const initialProducts: Product[] = [
  {
    id: "P-1001",
    title: "Classic Collar T-Shirt",
    brand: "Gildan",
    category: "T-Shirts",
    price: "$32.00",
    colors: "8 colors",
    sizes: ["S", "M", "L", "XL", "2XL"],
    material: "Cotton",
    weight: "5 oz",
    style: "Classic",
    description: "Everyday classic fit cotton tee with reinforced collar.",
    availableColors: [
      "#111827",
      "#FFFFFF",
      "#1D4ED8",
      "#DC2626",
      "#6B7280",
      "#15803D",
      "#92400E",
      "#7C3AED",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
  },
  {
    id: "P-1002",
    title: "Premium Performance Polo",
    brand: "Next Level",
    category: "Polos",
    price: "$35.00",
    colors: "4 colors",
    sizes: ["S", "M", "L", "XL"],
    material: "Polyester",
    weight: "4.3 oz",
    style: "Athletic",
    description: "Moisture-wicking performance polo for active wear.",
    availableColors: ["#111827", "#1D4ED8", "#DC2626", "#FFFFFF"],
    imageUrl:
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=500&fit=crop",
  },
  {
    id: "P-1003",
    title: "Heavyweight Pullover Hoodie",
    brand: "Flexfit",
    category: "Hoodies",
    price: "$45.00",
    colors: "6 colors",
    sizes: ["S", "M", "L", "XL", "2XL"],
    material: "Fleece",
    weight: "8.5 oz",
    style: "Casual",
    description: "Ultra-soft heavyweight pullover hoodie with kangaroo pocket.",
    availableColors: [
      "#111827",
      "#6B7280",
      "#1D4ED8",
      "#DC2626",
      "#15803D",
      "#92400E",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
  },
  {
    id: "P-1004",
    title: "Structured Trucker Hat",
    brand: "Port Authority",
    category: "Headwear",
    price: "$19.00",
    colors: "5 colors",
    sizes: ["One Size"],
    material: "Cotton/Mesh",
    weight: "2 oz",
    style: "Casual",
    description: "Structured front panels with breathable mesh back.",
    availableColors: ["#111827", "#FFFFFF", "#1D4ED8", "#92400E", "#6B7280"],
    imageUrl:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop",
  },
  {
    id: "P-1005",
    title: "Custom Tote Bag",
    brand: "Liberty Bags",
    category: "Bags",
    price: "$8.00",
    colors: "3 colors",
    sizes: ["One Size"],
    material: "Canvas",
    weight: "3 oz",
    style: "Everyday",
    description: "Durable canvas tote with reinforced handles.",
    availableColors: ["#111827", "#FFFFFF", "#92400E"],
    imageUrl:
      "https://images.unsplash.com/photo-1597633244018-8d6333ce7de9?w=500&h=500&fit=crop",
  },
  {
    id: "P-1006",
    title: "50/50 Crewneck Tee",
    brand: "Gildan",
    category: "T-Shirts",
    price: "$26.00",
    colors: "12 colors",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    material: "Cotton/Poly",
    weight: "5.5 oz",
    style: "Classic",
    description: "50/50 blend for the perfect weight and softness.",
    availableColors: [
      "#111827",
      "#FFFFFF",
      "#1D4ED8",
      "#DC2626",
      "#6B7280",
      "#15803D",
      "#92400E",
      "#7C3AED",
      "#F59E0B",
      "#EC4899",
      "#0891B2",
      "#84CC16",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=500&fit=crop",
  },
  {
    id: "P-1007",
    title: "Team Warm-up Jacket",
    brand: "Bella+Canvas",
    category: "Jackets",
    price: "$55.00",
    colors: "4 colors",
    sizes: ["S", "M", "L", "XL"],
    material: "Polyester",
    weight: "6 oz",
    style: "Athletic",
    description: "Lightweight athletic jacket with full zip.",
    availableColors: ["#111827", "#1D4ED8", "#6B7280", "#DC2626"],
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
  },
  {
    id: "P-1008",
    title: "Reversible Mesh Jersey",
    brand: "Carhartt",
    category: "Athletic",
    price: "$22.00",
    colors: "8 colors",
    sizes: ["S", "M", "L", "XL", "2XL"],
    material: "Polyester Mesh",
    weight: "3.8 oz",
    style: "Athletic",
    description: "Reversible jersey with two-tone design for team sports.",
    availableColors: [
      "#111827",
      "#FFFFFF",
      "#1D4ED8",
      "#DC2626",
      "#15803D",
      "#92400E",
      "#F59E0B",
      "#7C3AED",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop",
  },
];

export const emptyForm: NewProductForm = {
  itemNumber: "",
  productName: "",
  brand: "",
  category: "",
  price: "",
  colors: "",
  imageFile: null,
  imagePreview: "",
};

const Products = () => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    category: "All",
    brand: "All",
    color: "All",
    size: "All",
  });

  const setFilter = (key: string, val: string) =>
    setFilters((f) => ({ ...f, [key]: val }));

  const filtered = products.filter((p) => {
    const matchCategory =
      filters.category === "All" || p.category === filters.category;
    const matchBrand = filters.brand === "All" || p.brand === filters.brand;
    const matchSize = filters.size === "All" || p.sizes.includes(filters.size);
    return matchCategory && matchBrand && matchSize;
  });

  return (
    <div className="flex flex-col gap-6 ">
      <DashboardTopSection
        title="Product Catalog"
        description="Browse and manage your product catalog"
        backButton
        buttonOne="Add Product"
        actionOne={() => setShowAddModal(true)}
      />

      <FiltersSection filters={filters} setFilter={setFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            setSelectedProduct={setSelectedProduct}
          />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-[#A0B0C0]" />
            </div>
            <p className="text-[#374151] font-semibold mb-1">
              No products found
            </p>
            <p className="text-sm text-[#A0B0C0]">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </div>
      <div>
        <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={(p) => setProducts((prev) => [p, ...prev])}
        />
      )}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Products;
