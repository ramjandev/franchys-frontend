import { setTemplate } from "@/store/mockUp/designSlice";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import CardContainer from "../shared/CardContainer";
import CommonHeader from "../shared/CommonHeader";

const templateList = [
  { id: "front" as const, title: "T-Shirt - Front", category: "Apparel" },
  { id: "back" as const, title: "T-Shirt - Back", category: "Apparel" },
];

// Simple SVG T-shirt illustration
const ShirtIcon = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 80 70"
    width="80"
    height="70"
    className="mx-auto mb-2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 4 L4 18 L14 24 L14 66 L66 66 L66 24 L76 18 L60 4 L50 12 Q40 18 30 12 Z"
      fill={active ? "#DBEAFE" : "#F3F4F6"}
      stroke={active ? "#4A90E2" : "#D1D5DC"}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M30 12 Q40 18 50 12"
      stroke={active ? "#4A90E2" : "#99A1AF"}
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

const Template = () => {
  const dispatch = useDispatch();
  const { template } = useSelector((s: RootState) => s.design);

  return (
    <div>
      <CardContainer>
        <CommonHeader size="lg">Product Templates</CommonHeader>
        <div className="flex flex-col gap-4 pt-8">
          {templateList.map((item) => (
            <CardContainer
              key={item.id}
              onClick={() => dispatch(setTemplate(item.id))}
              className={`rounded-md! h-44 flex flex-col items-center justify-end cursor-pointer transition-all ${
                template === item.id
                  ? "bg-[#EFF6FF]! border-[#4A90E2]!"
                  : "hover:bg-gray-50!"
              }`}
            >
              <ShirtIcon active={template === item.id} />
              <CommonHeader className="text-[#101828]! font-semibold! text-center">
                {item.title}
              </CommonHeader>
              <CommonHeader className="text-center">
                {item.category}
              </CommonHeader>
            </CardContainer>
          ))}
        </div>
      </CardContainer>
    </div>
  );
};

export default Template;
