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
      <DialogContent
        showCloseButton={false}
        className="max-w-5xl p-2 border-none bg-transparent shadow-none focus:outline-none"
      >
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="cursor-pointer absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-50 rounded-full bg-black/80 p-2 text-white shadow-lg transition hover:scale-110 hover:bg-black focus:outline-none"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {previewImage && (
            <img
              src={previewImage}
              alt="Mockup Preview"
              className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl bg-white"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagesDialog;
