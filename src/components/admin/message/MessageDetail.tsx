import CommonButton from "@/components/shared/CommonButton";
import VideoSkeleton from "@/components/shared/loading/VideoSkeleton";
import {
  useGetThreadMessagesQuery,
  useReplyToThreadMutation,
} from "@/store/messages/emailTrackerAPI";

import { useState } from "react";
import { LuArrowUpRight, LuMessageSquareText } from "react-icons/lu";
import { TbMessage2Dollar } from "react-icons/tb";
import { z } from "zod";

interface MessageDetailProps {
  threadId: string;
}

interface ThreadMessage {
  id: string;
  threadId: string;
  direction: "OUTBOUND" | "INBOUND";
  from: string;
  to: string;
  body: string;
  messageId: string;
  inReplyTo: string | null;
  createdAt: string;
}

// ---------- helpers ----------

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const extractContact = (raw: string) => {
  const match = raw.match(/^(.*?)\s*<(.+)>$/);
  if (match) {
    return {
      name: match[1].trim().replace(/^"|"$/g, ""),
      email: match[2].trim(),
    };
  }
  return { name: raw, email: raw };
};

const getInitials = (raw: string) => {
  const { name, email } = extractContact(raw);
  const source = name && name.toLowerCase() !== "no reply" ? name : email;
  const parts = source.split(/[\s.@_-]+/).filter(Boolean);
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

type ParsedBody =
  | { kind: "text"; content: string }
  | { kind: "quote" | "invoice"; data: Record<string, string> };

const parseBody = (body: string): ParsedBody => {
  try {
    const json = JSON.parse(body);
    if (json?.type === "QUOTE") {
      return {
        kind: "quote",
        data: {
          number: json.quoteNumber ?? "",
          customerName: json.customerName ?? "",
          total: json.total ?? "",
          dueDate: json.dueDate ?? "",
          link: json.quoteLink || json.link || "",
          message: json.message ?? "",
        },
      };
    }
    if (json?.type === "INVOICE") {
      return {
        kind: "invoice",
        data: {
          number: json.invoiceNumber ?? "",
          customerName: json.customerName ?? "",
          total: json.total ?? "",
          amountDue: json.amountDue ?? "",
          dueDate: json.dueDate ?? "",
          link: json.hostedInvoiceUrl || json.link || "",
          message: json.message ?? "",
        },
      };
    }
  } catch {}
  return { kind: "text", content: body };
};

// ---------- document card ----------

const DocumentCard: React.FC<{
  kind: "quote" | "invoice";
  data: Record<string, string>;
}> = ({ kind, data }) => {
  const isInvoice = kind === "invoice";
  const accent = isInvoice
    ? "border-amber-400 bg-amber-50/60"
    : "border-emerald-400 bg-emerald-50/60";
  const badge = isInvoice
    ? "bg-amber-100 text-amber-700"
    : "bg-emerald-100 text-emerald-700";
  const button = isInvoice
    ? "bg-amber-600 hover:bg-amber-700"
    : "bg-emerald-600 hover:bg-emerald-700";

  return (
    <div
      className={`rounded-xl border-l-4 ${accent} border border-slate-100 p-4 max-w-sm`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${badge}`}
        >
          {isInvoice ? <TbMessage2Dollar /> : <LuMessageSquareText />}
          {isInvoice ? "Invoice" : "Quote"} {data.number}
        </span>
      </div>

      <p className="text-sm text-slate-600 mb-3">{data.message}</p>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 mb-3">
        {data.customerName && (
          <span>
            <span className="text-slate-400">Customer:</span>{" "}
            {data.customerName}
          </span>
        )}
        {(data.total || data.amountDue) && (
          <span>
            <span className="text-slate-400">Amount:</span>{" "}
            {data.amountDue || data.total}
          </span>
        )}
        {data.dueDate && (
          <span>
            <span className="text-slate-400">Due:</span> {data.dueDate}
          </span>
        )}
      </div>

      {data.link && (
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-colors ${button}`}
        >
          {isInvoice ? "View & pay" : "View quote"}
          <LuArrowUpRight />
        </a>
      )}
    </div>
  );
};

// ---------- reply validation ----------

const replySchema = z
  .string()
  .trim()
  .min(1, "Reply cannot be empty")
  .max(5000, "Reply must be under 5000 characters");

// ---------- main component ----------

const MessageDetail: React.FC<MessageDetailProps> = ({ threadId }) => {
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useGetThreadMessagesQuery(threadId, {
    skip: !threadId,
    refetchOnMountOrArgChange: true,
  });
  const [replyToThread, { isLoading: isSending }] = useReplyToThreadMutation();

  const messages: ThreadMessage[] = data?.data ?? [];
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
      await replyToThread({
        id: threadId,
        data: { text: result.data },
      }).unwrap();
      setReply("");
    } catch (err) {
      console.error("Failed to send reply", err);
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
        No messages in this thread.
      </div>
    );
  }

  const customerRaw =
    messages.find((m) => m.direction !== "OUTBOUND")?.from ?? latestMessage.to;
  const customer = extractContact(customerRaw);

  return (
    <div className="h-full flex flex-col bg-slate-50/40">
      {/* Header */}
      <div className="px-8 py-5 border-b border-slate-100 bg-white flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${avatarColor(
            customer.email,
          )}`}
        >
          {getInitials(customerRaw)}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-800 m-0 truncate">
            {customer.name}
          </h2>
          <p className="text-xs text-slate-400 truncate">
            {customer.email} &bull; {messages.length}{" "}
            {messages.length === 1 ? "message" : "messages"}
          </p>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5">
        {messages.map((m) => {
          const isOutbound = m.direction === "OUTBOUND";
          const contact = extractContact(m.from);
          const parsed = parseBody(m.body);

          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[80%] ${
                isOutbound ? "self-end flex-row-reverse" : "self-start"
              }`}
            >
              <div
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isOutbound
                    ? "bg-slate-900 text-white"
                    : avatarColor(contact.email)
                }`}
              >
                {getInitials(m.from)}
              </div>

              <div
                className={`flex flex-col gap-1 ${isOutbound ? "items-end" : "items-start"}`}
              >
                <span className="text-xs text-slate-400 px-1">
                  {isOutbound ? "You" : contact.name} &bull;{" "}
                  {formatDate(m.createdAt)}
                </span>

                {parsed.kind === "text" ? (
                  <div
                    className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      isOutbound
                        ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm"
                    }`}
                  >
                    {parsed.content}
                  </div>
                ) : (
                  <DocumentCard kind={parsed.kind} data={parsed.data} />
                )}
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
              disabled={!reply.trim()}
              loadingText="Sending..."
            >
              Send Reply
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;
