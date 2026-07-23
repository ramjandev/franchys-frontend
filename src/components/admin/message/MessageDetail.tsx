import CommonButton from "@/components/shared/CommonButton";
import { inputClass } from "@/pages/Login";
import {
  useGetThreadMessagesQuery,
  useReplyToThreadMutation,
} from "@/store/messages/emailTrackerAPI";

import { useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";

interface MessageDetailProps {
  threadId: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const MessageDetail: React.FC<MessageDetailProps> = ({ threadId }) => {
  const [reply, setReply] = useState("");

  const { data, isLoading } = useGetThreadMessagesQuery(threadId, {
    skip: !threadId,
    refetchOnMountOrArgChange: true,
  });
  const [replyToThread, { isLoading: isSending }] = useReplyToThreadMutation();

  const messages = data?.data ?? [];
  const latestMessage = messages[messages.length - 1];

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    try {
      await replyToThread({
        id: threadId,
        data: { text: reply },
      }).unwrap();
      setReply("");
    } catch (err) {
      console.error("Failed to send reply", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 h-full flex items-center justify-center text-sm text-slate-400">
        Loading thread...
      </div>
    );
  }

  if (!latestMessage) {
    return (
      <div className="p-8 h-full flex items-center justify-center text-sm text-slate-400">
        No messages in this thread.
      </div>
    );
  }

  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto">
      <h2 className="text-lg font-bold text-slate-800 m-0">
        {latestMessage.from}
      </h2>
      <p className="text-sm text-slate-400 mt-1.5 mb-6">
        To: {latestMessage.to} &bull; {formatDate(latestMessage.createdAt)}
      </p>
      <div className="flex-1 text-sm leading-relaxed text-slate-700 flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`border-b border-slate-100 pb-3 ${
              m.direction === "OUTBOUND"
                ? "pl-4 border-l-2 border-l-blue-200"
                : ""
            }`}
          >
            <p className="text-xs text-slate-400 mb-1">
              {m.direction === "OUTBOUND" ? "You" : m.from} &bull;{" "}
              {formatDate(m.createdAt)}
            </p>
            <p className="whitespace-pre-line">{m.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-sm font-semibold text-slate-700 mb-2">Reply</p>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply here..."
          rows={4}
          className={`${inputClass.input} resize-none`}
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm  text-[#4A5565]">
            <MdOutlineMailOutline size={20} /> Attach File
          </span>

          <div className="flex gap-2">
            <CommonButton>Save Draft</CommonButton>
            <CommonButton onClick={handleSendReply} disabled={isSending}>
              {isSending ? "Sending..." : "Send Reply"}
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;
