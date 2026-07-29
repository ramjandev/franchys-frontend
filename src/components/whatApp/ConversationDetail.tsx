import CommonButton from "@/components/shared/CommonButton";
import VideoSkeleton from "@/components/shared/loading/VideoSkeleton";
import { WhatsAppMessage } from "@/store/whatApp/types/whatsappTrackerTypes";
import {
  useGetConversationMessagesQuery,
  useReplyToConversationMutation,
} from "@/store/whatApp/whatsappTrackerAPI";

import { useState } from "react";
import { z } from "zod";

interface ConversationDetailProps {
  conversationId: string;
}

// ---------- helpers ----------

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getInitials = (name: string | null, phone: string) => {
  const source = name && name.trim() ? name : phone;
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
};

const AVATAR_PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

const avatarColor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};

const TEMPLATE_PREFIX = /^\[Template:\s*([^\]]+)\]\s*/;

const parseWhatsAppBody = (body: string) => {
  const match = body.match(TEMPLATE_PREFIX);
  if (match) {
    return {
      templateName: match[1],
      content: body.replace(TEMPLATE_PREFIX, ""),
    };
  }
  return { templateName: null as string | null, content: body };
};

// bolds *text*, linkifies URLs, leaves \n to CSS white-space handling
const RICH_TEXT_TOKEN = /(\*[^*]+\*)|(https?:\/\/[^\s]+)/g;

const renderRichText = (text: string, keyPrefix: string) => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  RICH_TEXT_TOKEN.lastIndex = 0;

  while ((match = RICH_TEXT_TOKEN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`}>{match[1].slice(1, -1)}</strong>,
      );
    } else if (match[2]) {
      nodes.push(
        <a
          key={`${keyPrefix}-l-${i}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline break-all"
        >
          {match[2]}
        </a>,
      );
    }
    lastIndex = RICH_TEXT_TOKEN.lastIndex;
    i++;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
};

// ---------- reply validation ----------

const replySchema = z
  .string()
  .trim()
  .min(1, "Reply cannot be empty")
  .max(4096, "WhatsApp messages must be under 4096 characters");

// ---------- main component ----------

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  conversationId,
}) => {
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useGetConversationMessagesQuery(conversationId, {
    skip: !conversationId,
    refetchOnMountOrArgChange: true,
  });
  const [replyToConversation, { isLoading: isSending }] =
    useReplyToConversationMutation();

  const messages: WhatsAppMessage[] = data?.data ?? [];
  const latestMessage = messages[messages.length - 1];

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReply(e.target.value);
    if (error) setError(null);
  };

  const handleSendReply = async () => {
    const result = replySchema.safeParse(reply);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid reply");
      return;
    }
    setError(null);
    try {
      await replyToConversation({
        id: conversationId,
        data: { text: result.data },
      }).unwrap();
      setReply("");
    } catch (err) {
      console.error("Failed to send WhatsApp reply", err);
      setError("Failed to send reply. Please try again.");
    }
  };

  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending && reply.trim()) {
        handleSendReply();
      }
    }
  };

  if (isLoading) {
    return <VideoSkeleton />;
  }

  if (!latestMessage) {
    return (
      <div className="p-8 h-full flex items-center justify-center text-sm text-slate-400">
        No messages in this conversation.
      </div>
    );
  }

  const inboundMessage = messages.find((m) => m.direction === "INBOUND");
  const contactPhone = inboundMessage?.from ?? latestMessage.to;

  return (
    <div className="h-full flex flex-col bg-slate-50/40">
      {/* Header */}
      <div className="px-8 py-5 border-b border-slate-100 bg-white flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${avatarColor(
            contactPhone,
          )}`}
        >
          {getInitials(null, contactPhone)}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-800 m-0 truncate">
            {contactPhone}
          </h2>
          <p className="text-xs text-slate-400 truncate">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </p>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5">
        {messages.map((m) => {
          const isOutbound = m.direction === "OUTBOUND";
          const { templateName, content } = parseWhatsAppBody(m.body);

          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[80%] ${
                isOutbound ? "self-end flex-row-reverse" : "self-start"
              }`}
            >
              <div
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isOutbound ? "bg-slate-900 text-white" : avatarColor(m.from)
                }`}
              >
                {getInitials(null, isOutbound ? m.to : m.from)}
              </div>

              <div
                className={`flex flex-col gap-1 ${
                  isOutbound ? "items-end" : "items-start"
                }`}
              >
                <span className="text-xs text-slate-400 px-1 flex items-center gap-1.5">
                  {isOutbound ? "You" : contactPhone} &bull;{" "}
                  {formatDate(m.createdAt)}
                  {templateName && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium px-1.5 py-0.5">
                      Template
                    </span>
                  )}
                </span>

                <div
                  className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    isOutbound
                      ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm"
                      : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm"
                  }`}
                >
                  {renderRichText(content, m.id)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply composer */}
      <div className="px-8 py-5 border-t border-slate-100 bg-white">
        <div
          className={`rounded-2xl border transition-colors ${
            error
              ? "border-red-300"
              : "border-slate-200 focus-within:border-slate-400"
          }`}
        >
          <textarea
            value={reply}
            onChange={handleReplyChange}
            onKeyDown={handleReplyKeyDown}
            placeholder="Type your reply..."
            rows={3}
            className="w-full resize-none border-0 bg-transparent px-4 pt-3 pb-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-xs text-red-500">{error}</span>
            <CommonButton
              onClick={handleSendReply}
              isLoading={isSending}
              loadingText="Sending..."
              disabled={isSending || !reply.trim()}
            >
              Send Reply
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;
