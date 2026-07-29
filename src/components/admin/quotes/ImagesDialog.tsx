import { X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Props {
  previewImage: string | null;
  setPreviewImage: (previewImage: string | null) => void;
}
const ImagesDialog: React.FC<Props> = ({ previewImage, setPreviewImage }) => {
  return (
    <Dialog
      open={!!previewImage}
      onOpenChange={(open) => {
        if (!open) setPreviewImage(null);
      }}
    >
      <DialogContent className="max-w-5xl p-2 border-none bg-transparent shadow-none">
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => setPreviewImage(null)}
            className="cursor-pointer! absolute top-2 right-2 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black"
          >
            <X className="h-5 w-5" />
          </button>

          {previewImage && (
            <img
              src={previewImage}
              alt="Mockup Preview"
              className="max-h-[90vh] w-auto rounded-lg object-contain"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagesDialog;
