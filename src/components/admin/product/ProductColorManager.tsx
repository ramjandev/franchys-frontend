import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import IconActionButton from "@/components/shared/IconActionButton";
import {
  useCreateProductColorsMutation,
  useDeleteProductColorMutation,
  useGetProductColorsQuery,
  useUpdateProductColorMutation,
} from "@/store/Product/productAPI";
import { useState } from "react";

interface ProductColorManagerProps {
  productId: string;
}

const ProductColorManager: React.FC<ProductColorManagerProps> = ({
  productId,
}) => {
  const { data, isLoading } = useGetProductColorsQuery(productId);
  const [createColors, { isLoading: isAdding }] =
    useCreateProductColorsMutation();
  const [updateColor, { originalArgs: updateColorArgs }] =
    useUpdateProductColorMutation();
  const [deleteColor, { originalArgs }] = useDeleteProductColorMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("#000000");

  const colors = data?.data ?? [];

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await createColors({
        productId,
        data: [{ name: newName, code: newCode }],
      }).unwrap();
      setNewName("");
      setNewCode("#000000");
    } catch (err) {
      console.error("Failed to add color", err);
    }
  };

  const startEdit = (id: string, name: string, code: string) => {
    setEditingId(id);
    setEditName(name);
    setEditCode(code);
  };

  const saveEdit = async (colorId: string) => {
    try {
      await updateColor({
        productId,
        colorId,
        data: { name: editName, code: editCode },
      }).unwrap();
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update color", err);
    }
  };

  const handleDelete = async (colorId: string) => {
    try {
      await deleteColor({ productId, colorId }).unwrap();
    } catch (err) {
      console.error("Failed to delete color", err);
    }
  };

  return (
    <div className="space-y-2">
      <CommonHeader size="xs" className="text-[#62748E]! font-medium!">
        COLORS ({colors.length})
      </CommonHeader>

      {isLoading && <p className="text-xs text-[#62748E]">Loading colors...</p>}

      <div className="space-y-2">
        {colors.map((color) => (
          <div key={color.id} className="flex items-center gap-2">
            {editingId === color.id ? (
              <>
                <label className="relative w-8 h-8 rounded-lg border border-slate-200 cursor-pointer shrink-0 overflow-hidden">
                  <input
                    type="color"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                  />
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: editCode }}
                  />
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 text-sm border border-border rounded-lg px-2 py-1.5"
                />
                <button
                  type="button"
                  onClick={() => saveEdit(color.id)}
                  className="text-xs font-semibold text-[#155DFC] hover:underline cursor-pointer shrink-0"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-xs font-semibold text-[#62748E] hover:underline cursor-pointer shrink-0"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  className="w-7 h-7 rounded-full border-2 border-white shadow ring-1 ring-[#E6EBF2] shrink-0"
                  style={{ background: color.code }}
                  title={color.name}
                />
                <span className="flex-1 text-sm text-[#314158]">
                  {color.name}
                </span>

                <IconActionButton
                  title="Edit"
                  variant="edit"
                  onClick={() => startEdit(color.id, color.name, color.code)}
                  isLoading={updateColorArgs?.colorId === color.id}
                />
                <IconActionButton
                  title="Delete"
                  variant="delete"
                  onClick={() => handleDelete(color.id)}
                  isLoading={originalArgs?.colorId === color.id}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new color */}
      <div className="flex items-center gap-2 pt-1">
        <label className="relative w-8 h-8 rounded-lg border border-slate-200 cursor-pointer shrink-0 overflow-hidden">
          <input
            type="color"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
          <div className="w-full h-full" style={{ backgroundColor: newCode }} />
        </label>
        <input
          type="text"
          placeholder="New color name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 text-sm border border-border rounded-lg px-2 py-1.5"
        />

        <CommonButton
          size="sm"
          type="button"
          onClick={handleAdd}
          isLoading={isAdding}
          loadingText="Adding..."
          className="px-2!  mt-2! text-[10px]!"
        >
          + Add Color
        </CommonButton>
      </div>
    </div>
  );
};

export default ProductColorManager;
