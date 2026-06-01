import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import CommonSelect from "@/components/shared/CommonSelect";
import { inputClass } from "@/pages/Login";
import { Image, Plus, Zap } from "lucide-react";
import { useState } from "react";

const defaultRow = {
  category: "",
  itemNo: "",
  color: "",
  description: "",
  m: 0,
  l: 0,
  xl: 0,
  items: 0,
  markup: 0,
  price: 0,
  taxed: false,
};

type Row = typeof defaultRow;



const calcTotal = (row: Row) => {
  const items = Number(row.items) || 0;
  const price = Number(row.price) || 0;
  const markup = Number(row.markup) || 0;
  return (items * price * (1 + markup / 100)).toFixed(2);
};

const tableHeaders = [
  "Category",
  "Item #",
  "Color",
  "Description",
  "M",
  "L",
  "XL",
  "Items",
  "Markup %",
  "Price",
  "Taxed",
  "Total",
];

const LineItems = () => {
  const [groupName, setGroupName] = useState("Group 1");
  const [imprint, setImprint] = useState("");
  const [showColumnInput, setShowColumnInput] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [rows, setRows] = useState<Row[]>([{ ...defaultRow }]);

  const updateRow = (
    idx: number,
    field: keyof Row,
    value: string | number | boolean,
  ) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
    );
  };

  return (
    <CardContainer size="lg" className="">
      <div className="flex items-center justify-between mb-6">
        <CommonHeader size="lg">Line Items</CommonHeader>

        <CommonButton variant="blue">
          <Plus className="w-4 h-4 text-white" /> Add Group
        </CommonButton>
      </div>

      <div className="p-6 rounded-[10px] bg-[#F8FAFC] border border-[#CAD5E2]">
        <div className="flex flex-col md:flex-row  gap-4 mb-5">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className={`${inputClass.input} w-50!`}
          />

          <div className="flex flex-col md:flex-row md:items-center  md:gap-2.5 ">
            <label className={inputClass.label}> Imprint Type:</label>
            <CommonSelect
              value={imprint}
              item={[
                { label: "Embroidery", value: "embroidery" },
                { label: "Screen Print", value: "screen" },
                { label: "DTG", value: "dtg" },
              ]}
              placeholder="Select imprint"
              onValueChange={(value) => setImprint(value)}
              w={200}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 mb-5 flex-wrap">
          <label className={inputClass.label}>Manage Columns:</label>
          {!showColumnInput ? (
            <CommonButton
              variant="blue"
              onClick={() => setShowColumnInput(true)}
              className="bg-[#F1F5F9]! text-[#155DFC]!"
            >
              <Plus className="w-4 h-4 text-[#155DFC]" /> Add Column
            </CommonButton>
          ) : (
            <>
              <input
                type="text"
                placeholder="Column name..."
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                className={`${inputClass.input} w-40!`}
              />

              <CommonButton
                variant="blue"
                onClick={() => {
                  setShowColumnInput(false);
                  setColumnName("");
                }}
              >
                Add
              </CommonButton>
              <CommonButton
                onClick={() => {
                  setShowColumnInput(false);
                  setColumnName("");
                }}
              >
                Cancel
              </CommonButton>
            </>
          )}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div
              className="grid gap-1.5 pb-2 border-b border-[#CAD5E2] mb-2"
              style={{
                gridTemplateColumns:
                  "120px 50px 65px 1fr 60px 60px 60px 65px 85px 50px 50px 65px",
              }}
            >
              {tableHeaders.map((h) => (
                <div key={h} className="text-[12px] font-bold text-slate-700">
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid gap-1.5 mb-2 items-center"
                style={{
                  gridTemplateColumns:
                    "120px 50px 65px 1fr 60px 60px 60px 65px 85px 50px 50px 65px",
                }}
              >
                <CommonSelect
                  item={[
                    { label: "Apparel", value: "apparel" },
                    { label: "Promo", value: "promo" },
                  ]}
                  value={row.category}
                  onValueChange={(e) => updateRow(idx, "category", e)}
                  placeholder="Select"
                  className="w-full! sm:w-auto!"
                />

                <input
                  type="text"
                  value={row.itemNo}
                  onChange={(e) => updateRow(idx, "itemNo", e.target.value)}
                  className={inputClass.input}
                />
                <input
                  type="text"
                  value={row.color}
                  onChange={(e) => updateRow(idx, "color", e.target.value)}
                  className={inputClass.input}
                />
                <input
                  type="text"
                  placeholder="Product description..."
                  value={row.description}
                  onChange={(e) =>
                    updateRow(idx, "description", e.target.value)
                  }
                  className={inputClass.input}
                />
                {(["m", "l", "xl", "items", "markup"] as const).map((f) => (
                  <input
                    key={f}
                    type="number"
                    min={0}
                    value={row[f] as number}
                    onChange={(e) => updateRow(idx, f, e.target.value)}
                    className={inputClass.input}
                  />
                ))}
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={row.price}
                    onChange={(e) => updateRow(idx, "price", e.target.value)}
                    className={`${inputClass.input} pl-5`}
                  />
                </div>
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={row.taxed}
                    onChange={(e) => updateRow(idx, "taxed", e.target.checked)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                </div>
                <span className="text-[13px] font-semibold text-slate-800">
                  ${calcTotal(row)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="inline-flex items-center gap-2 border border-[#CAD5E2] rounded-lg px-3.5 py-2 bg-white text-[13px] font-semibold text-slate-800">
            <Zap size={14} className="text-blue-600" />
            IMPRINT 1{" "}
            <span className="text-slate-400 font-normal ml-1">Embroidery</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
          <div className="flex gap-2.5">
            <CommonButton
              onClick={() => setRows((prev) => [...prev, { ...defaultRow }])}
              className="bg-black! text-white!"
            >
              <Plus size={13} /> Line Item
            </CommonButton>
            <CommonButton onClick={() => setRows((prev) => prev.slice(0, -1))}>
              <Zap size={13} className="text-[#314158]" /> Imprint
            </CommonButton>
          </div>
          <CommonButton className="">
            <Image size={13} /> Mockup Creator
          </CommonButton>
        </div>
      </div>
    </CardContainer>
  );
};

export default LineItems;
