import { ApiResponse } from "@/store/Auth/types/authTypes";

// ---- Thread (from GET /emails/threads) ----

export interface EmailThreadContact {
  id: string;
  email: string;
  name: string | null;
}

export interface EmailThread {
  id: string;
  subject: string;
  contactId: string;
  lastActivity: string;
  contact: EmailThreadContact;
}

// ---- Message (from GET /emails/threads/{id}/messages) ----

export type EmailMessageDirection = "INBOUND" | "OUTBOUND";

export interface EmailMessage {
  id: string;
  threadId: string;
  direction: EmailMessageDirection;
  from: string;
  to: string;
  body: string;
  messageId: string;
  inReplyTo: string | null;
  createdAt: string;
}

// ---- Request payloads ----

export interface ReplyToThreadPayload {
  text: string;
}

// ---- Response envelopes ----

export type GetEmailThreadsResponse = ApiResponse<EmailThread[]>;
export type GetThreadMessagesResponse = ApiResponse<EmailMessage[]>;
export type ReplyToThreadResponse = ApiResponse<EmailMessage>;
export type StartWatchResponse = ApiResponse<{ message: string }>;
