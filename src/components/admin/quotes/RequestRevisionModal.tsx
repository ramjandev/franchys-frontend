import ModalAction from "@/components/settings/ModalAction";
import ModalContainer from "@/components/settings/ModalContainer";
import { inputClass } from "@/pages/Login";
import { useRequestQuoteRevisionMutation } from "@/store/quote/quoteAPI";
import { useState } from "react";
import { z } from "zod";

interface RequestRevisionModalProps {
  close: () => void;
  quoteId: string;
}

const revisionSchema = z.object({
  notes: z
    .string()
    .trim()
    .min(10, "Please describe the revision in at least 10 characters")
    .max(1000, "Notes must be under 1000 characters"),
});

type RevisionFormErrors = Partial<
  Record<keyof z.infer<typeof revisionSchema>, string>
>;

const RequestRevisionModal: React.FC<RequestRevisionModalProps> = ({
  close,
  quoteId,
}) => {
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<RevisionFormErrors>({});

  const [requestQuoteRevision, { isLoading: isSubmitting }] =
    useRequestQuoteRevisionMutation();

  const handleSubmit = async () => {
    const result = revisionSchema.safeParse({ notes });

    if (!result.success) {
      const fieldErrors: RevisionFormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof RevisionFormErrors;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      await requestQuoteRevision({
        id: quoteId,
        data: { notes: result.data.notes },
      }).unwrap();
      close();
    } catch {}
  };

  return (
    <ModalContainer
      close={close}
      title="Request Revision"
      description="Let us know what changes you'd like on this quote"
    >
      <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className={inputClass.label}>Revision Notes</label>
          <textarea
            placeholder="Describe the changes you'd like..."
            className={`${inputClass.input} min-h-[120px] resize-none`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {errors.notes && (
            <p className="text-xs text-red-500 mt-1">{errors.notes}</p>
          )}
        </div>
      </form>

      <ModalAction
        close={close}
        create="Send Request"
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </ModalContainer>
  );
};

export default RequestRevisionModal;
