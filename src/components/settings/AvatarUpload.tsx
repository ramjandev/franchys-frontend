import { Button } from "@/components/ui/button";
import { designGrid } from "@/pages/Admin/Settings/ProfileSettings";
import { inputClass } from "@/pages/Login";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface AvatarUploadProps {
  label?: string;
  hint?: string;
  value?: string | null;
  onChange?: (dataUrl: string | null) => void;
  accept?: string;
}

const AvatarUpload = ({
  label = "Avatar",
  hint = "200 by 200px minimum size",
  value,
  onChange,
  accept = "image/*",
}: AvatarUploadProps) => {
  const [internalPreview, setInternalPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = value !== undefined ? value : internalPreview;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (onChange) onChange(dataUrl);
      else setInternalPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    if (onChange) onChange(null);
    else setInternalPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={designGrid}>
      <label className={`${inputClass.label} sm:text-right`}>{label}</label>

      <div className="flex items-center gap-4">
        {preview && (
          <div className="relative w-16 h-16 shrink-0">
            <img
              src={preview}
              alt={`${label} preview`}
              className="w-16 h-16 rounded-full object-cover border border-slate-200"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:border-red-300 transition cursor-pointer"
            >
              <X size={11} className="text-slate-500 hover:text-red-500" />
            </button>
          </div>
        )}

        <div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="h-8 px-4 text-xs font-medium border-slate-200 bg-slate-50 gap-1.5 cursor-pointer"
          >
            <Upload size={13} />
            {preview ? "Change photo" : "Choose File"}
          </Button>
          {hint && <p className="text-xs text-[#45556C] mt-1.5">{hint}</p>}
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
