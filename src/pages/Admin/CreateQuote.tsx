import CreateQuoteForm from "@/components/admin/quotes/CreateQuoteForm";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { useParams } from "react-router-dom";

const CreateQuote = () => {
  const { id: quoteId } = useParams();

  const isEdit = !!quoteId;
  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardTopSection
        title={isEdit ? "Edit Quote" : "Create New Quote"}
        description={
          isEdit
            ? "Update an existing quote."
            : "Build a quote and send it to your customer."
        }
        backButton
      />
      <CreateQuoteForm />
    </div>
  );
};

export default CreateQuote;
