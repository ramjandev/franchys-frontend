import Pagination from "@/components/shared/Pagination";
import { EmailThread } from "@/store/messages/types/emailTrackerTypes";
import { useState } from "react";

interface MessageListProps {
  threads: EmailThread[];
  isLoading: boolean;
  selectedThreadId: string | null;
  onSelect: (threadId: string) => void;
}

const PAGE_SIZE = 10;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const MessageList: React.FC<MessageListProps> = ({
  threads,
  isLoading,
  selectedThreadId,
  onSelect,
}) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(threads.length / PAGE_SIZE));
  const paginatedThreads = threads.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {isLoading && (
        <p className="px-4 py-4 text-sm text-slate-400">Loading messages...</p>
      )}
      {!isLoading && threads.length === 0 && (
        <p className="px-4 py-4 text-sm text-slate-400">No messages found.</p>
      )}
      {paginatedThreads.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`w-full text-left px-4 py-4 border-b border-slate-100 cursor-pointer transition-colors ${
            selectedThreadId === t.id
              ? "bg-blue-50 border-l-4 border-l-blue-500"
              : "bg-transparent border-l-4 border-l-transparent hover:bg-slate-50"
          }`}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate font-medium text-slate-700">
                {t.subject}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                By: {t.contact.name ?? t.contact.email}
              </p>
              <p className="text-[11px] text-slate-400 mt-1.5">
                {formatDate(t.lastActivity)}
              </p>
            </div>
          </div>
        </button>
      ))}
      <div className="flex items-center justify-center gap-1 py-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default MessageList;
