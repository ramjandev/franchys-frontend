import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const productsData = [
  {
    id: "P-1001",
    title: "Classic Collar T-Shirt",
    brand: "Gildan",
    price: "$32.00",
    colors: "8 colors",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
  },
  {
    id: "P-1002",
    title: "Premium Performance Polo",
    brand: "Next Level",
    price: "$35.00",
    colors: "4 colors",
    imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=500&fit=crop",
  },
  {
    id: "P-1003",
    title: "Heavyweight Pullover Hoodie",
    brand: "Flexfit",
    price: "$45.00",
    colors: "6 colors",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
  },
  {
    id: "P-1004",
    title: "Structured Trucker Hat",
    brand: "Port Authority",
    price: "$19.00",
    colors: "5 colors",
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop",
  },
  {
    id: "P-1005",
    title: "Custom Tote Bag",
    brand: "Liberty Bags",
    price: "$8.00",
    colors: "3 colors",
    imageUrl: "https://images.unsplash.com/photo-1597633244018-8d6333ce7de9?w=500&h=500&fit=crop",
  },
  {
    id: "P-1006",
    title: "50/50 Crewneck Tee",
    brand: "Gildan",
    price: "$26.00",
    colors: "12 colors",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=500&fit=crop",
  },
  {
    id: "P-1007",
    title: "Team UT Ath Jacket",
    brand: "Bella+Canvas",
    price: "$55.00",
    colors: "4 colors",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
  },
  {
    id: "P-1008",
    title: "Reversible Mesh Jersey",
    brand: "Carhartt",
    price: "$22.00",
    colors: "8 colors",
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop",
  },
];

const Products = () => {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/admin/dashboard" className="mt-1">
            <ArrowLeft className="w-5 h-5 text-[#5C7899] hover:text-[#111827]" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-[#111827] mb-1">
              Product Catalog
            </h1>
            <p className="text-sm text-[#5C7899]">
              Browse and manage your product catalog
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-10 px-4 bg-[#053F7A] hover:bg-[#042f5a] text-white rounded-lg gap-2 font-medium">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#5C7899] uppercase tracking-wider">Category</label>
            <select className="w-full h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm text-[#111827] outline-none focus:border-[#0077FF]">
              <option>All</option>
              <option>T-Shirts</option>
              <option>Outerwear</option>
              <option>Accessories</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#5C7899] uppercase tracking-wider">Brand</label>
            <select className="w-full h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm text-[#111827] outline-none focus:border-[#0077FF]">
              <option>All</option>
              <option>Gildan</option>
              <option>Next Level</option>
              <option>Bella+Canvas</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#5C7899] uppercase tracking-wider">Color</label>
            <select className="w-full h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm text-[#111827] outline-none focus:border-[#0077FF]">
              <option>All</option>
              <option>Black</option>
              <option>White</option>
              <option>Navy</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#5C7899] uppercase tracking-wider">Size</label>
            <select className="w-full h-10 border border-[#E6EBF2] rounded-lg px-3 text-sm text-[#111827] outline-none focus:border-[#0077FF]">
              <option>All</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsData.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden border border-[#F1F5F9] group cursor-pointer hover:shadow-lg transition-all">
            {/* Image Container */}
            <div className="w-full h-64 bg-[#F8FAFC] relative overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content Container */}
            <div className="p-4 border-t border-[#F1F5F9] bg-white">
              <h3 className="font-bold text-[#111827] text-[15px] mb-1 truncate" title={product.title}>
                {product.title}
              </h3>
              <p className="text-xs text-[#5C7899] mb-4 font-medium">{product.brand}</p>
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111827]">{product.price}</span>
                <span className="text-xs text-[#A0B0C0] font-medium">{product.colors}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;