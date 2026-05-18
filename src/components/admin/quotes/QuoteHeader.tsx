import logo from "@/assets/images/textLogo.png";
import CommonHeader from "@/components/shared/CommonHeader";

const orderDetails = [
  {
    label: "Sales Rep:",
    value: "Maria Laura Marte",
    color: "#0F172B",
  },
  {
    label: "Delivery Method:",
    value: "Pick-up",
    color: "#0F172B",
  },
  {
    label: "PO Number:",
    value: "PO-2024-456",
    color: "#0F172B",
  },
  {
    label: "Customer Due Date:",
    value: "05/02/2026",
    color: "#E7000B",
  },
  {
    label: "Production Due Date:",
    value: "04/28/2026",
    color: "#0F172B",
  },
];
const QuoteHeader = () => {
  return (
    <div>
      <div className="flex justify-between items-start pb-4 mb-4 ">
        <div>
          <div className=" w-25 h-22.5 mb-3">
            <img
              src={logo}
              alt="logo"
              className=" w-full h-full object-cover"
            />
          </div>
          <CommonHeader size="xs" className="">
            456 Commerce Avenue
            <br />
            Los Angeles, CA 90001
            <br />
            (555) 987-6543
            <br />
            quotes@printflowpro.com
          </CommonHeader>
        </div>
        <div className=" flex flex-col justify-end ">
          <CommonHeader size="2xl" className="mb-1 justify-end!">
            QUOTE
          </CommonHeader>
          <CommonHeader size="lg" className="text-skyBlue justify-end!">
            Q-1024
          </CommonHeader>

          <CommonHeader size="xs" className=" mt-1 justify-end!">
            Date: 04/15/2026
          </CommonHeader>
          <CommonHeader size="xs" className=" mt-1 justify-end!">
            Expires: 05/15/2026
          </CommonHeader>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <div className="text-xs text-[#62748E] font-medium mb-1">
            QUOTE FOR:
          </div>
          <CommonHeader size="lg" className="text-[#0F172B]! font-bold!">
            Riverside Church
          </CommonHeader>
          <CommonHeader size="xs" className=" mt-0.5">
            John Smith
            <br />
            789 Church Street
            <br />
            Austin, TX 78701
            <br />
            john@riversidechurch.org
            <br />
            (555) 123-4587
          </CommonHeader>
        </div>
        <div className="w-60 space-y-3">
          {orderDetails.map((detail, i) => (
            <div className="w-full flex justify-between gap-3">
              <CommonHeader size="xs" className="">
                {detail.label}
              </CommonHeader>
              <CommonHeader
                size="xs"
                className={` ${i === 0 ? "text-[#0F172B]! font-bold" : ""} ${i === 3 ? "text-[#E7000B]! font-bold" : ""}`}
              >
                {detail.value}
              </CommonHeader>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteHeader;
