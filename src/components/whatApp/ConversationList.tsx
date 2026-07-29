import VideoSkeleton from "@/components/shared/loading/VideoSkeleton";
import Pagination from "@/components/shared/Pagination";
import { WhatsAppConversation } from "@/store/whatApp/types/whatsappTrackerTypes";
import { useState } from "react";
interface ConversationListProps {
  conversations: WhatsAppConversation[];
  isLoading: boolean;
  selectedConversationId: string | null;
  onSelect: (conversationId: string) => void;
}

const PAGE_SIZE = 10;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const stripFormatting = (body: string) =>
  body
    .replace(/^\[Template:\s*[^\]]+\]\s*/, "")
    .replace(/\*/g, "")
    .replace(/\n+/g, " ")
    .trim();

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading,
  selectedConversationId,
  onSelect,
}) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(conversations.length / PAGE_SIZE));
  const paginatedConversations = conversations.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {isLoading && <VideoSkeleton />}
      {paginatedConversations.map((c) => {
        const preview = c.messages[0]?.body
          ? stripFormatting(c.messages[0].body)
          : "No messages yet";

        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full text-left px-4 py-4 border-b border-slate-100 cursor-pointer transition-colors ${
              selectedConversationId === c.id
                ? "bg-blue-50 border-l-4 border-l-blue-500"
                : "bg-transparent border-l-4 border-l-transparent hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate font-medium text-slate-700">
                  {c.contact.name ?? c.contact.phone}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {preview}
                </p>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  {formatDate(c.lastActivity)}
                </p>
              </div>
            </div>
          </button>
        );
      })}

      {totalPages > 1 &&
        paginatedConversations.length < conversations.length && (
          <div className="flex items-center justify-center gap-1 py-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
    </div>
  );
};

export default ConversationList;
