import { PRODUCTS } from "./MessageData";

interface ProductCatalogProps {
  selected: number[];
  onToggle: (id: number) => void;
}
const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selected,
  onToggle,
}) => (
  <div className=" shrink-0 bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 overflow-y-auto">
    <div className="flex items-center justify-between">
      <span className="font-bold text-[15px] text-slate-800">
        Product Catalog
      </span>
      <span className="bg-slate-100 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
        {selected.length} selected
      </span>
    </div>
    <p className="text-xs text-slate-400 mt-0">
      Select products to feature in your campaign
    </p>
    <div className="flex flex-col gap-2">
      {PRODUCTS.map((p) => {
        const sel = selected.includes(p.id);
        return (
          <button
            key={p.id}
            onClick={() => onToggle(p.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
              sel
                ? "border-blue-500 bg-blue-50"
                : "border-slate-100 bg-white hover:border-slate-200"
            }`}
          >
            <span className="text-2xl">{p.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">
                {p.name}
              </p>
              <p className="text-xs text-slate-400">{p.category}</p>
              <p className="text-sm font-bold text-blue-500">{p.price}</p>
            </div>
            {sel && <span className="text-blue-500 text-base shrink-0">✓</span>}
          </button>
        );
      })}
    </div>
    {selected.length > 0 && (
      <div className="rounded-lg bg-green-50 py-2 text-center text-sm font-semibold text-green-600">
        {selected.length} product{selected.length > 1 ? "s" : ""} linked
      </div>
    )}
  </div>
);

export default ProductCatalog;
