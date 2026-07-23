import CardContainer from "@/components/shared/CardContainer";
import CommonSelect from "@/components/shared/CommonSelect";
import { inputClass } from "@/pages/Login";
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
} from "@/store/settings/brandCategory/brandCategoryApi";

const ColorOptions = [
  { label: "All", value: "All" },
  { label: "Black", value: "Black" },
  { label: "White", value: "White" },
  { label: "Navy", value: "Navy" },
  { label: "Red", value: "Red" },
  { label: "Gray", value: "Gray" },
  { label: "Green", value: "Green" },
];
const SizeOptions = [
  { label: "All", value: "All" },
  { label: "XS", value: "XS" },
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "2XL", value: "2XL" },
  { label: "One Size", value: "One Size" },
];

interface FiltersSectionProps {
  filters: {
    category: string;
    brand: string;
    color: string;
    size: string;
  };
  setFilter: (key: string, val: string) => void;
}
const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  setFilter,
}) => {
  const { data: categoryData } = useGetCategoriesQuery({});
  const { data: brandData } = useGetBrandsQuery({});

  const CategoryOptions = [
    { label: "All", value: "All" },
    ...(categoryData?.data ?? []).map((c) => ({
      label: c.name,
      value: c.name,
    })),
  ];

  const BrandOptions = [
    { label: "All", value: "All" },
    ...(brandData?.data ?? []).map((b) => ({
      label: b.name,
      value: b.name,
    })),
  ];

  return (
    <CardContainer size="sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className={inputClass.label}>CATEGORY</label>
          <CommonSelect
            item={CategoryOptions}
            value={filters.category}
            onValueChange={(val) => {
              setFilter("category", val);
            }}
            className="w-full! "
          />
        </div>
        <div>
          <label className={inputClass.label}>BRAND</label>
          <CommonSelect
            item={BrandOptions}
            value={filters.brand}
            onValueChange={(val) => {
              setFilter("brand", val);
            }}
            className="w-full! "
          />
        </div>
        <div>
          <label className={inputClass.label}>COLOR</label>
          <CommonSelect
            item={ColorOptions}
            value={filters.color}
            onValueChange={(val) => {
              setFilter("color", val);
            }}
            className="w-full! "
          />
        </div>
        <div>
          <label className={inputClass.label}>SIZE</label>
          <CommonSelect
            item={SizeOptions}
            value={filters.size}
            onValueChange={(val) => {
              setFilter("size", val);
            }}
            className="w-full! "
          />
        </div>
      </div>
    </CardContainer>
  );
};

export default FiltersSection;
