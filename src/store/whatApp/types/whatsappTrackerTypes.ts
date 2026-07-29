import { ApiResponse } from "@/store/Auth/types/authTypes";

// ---- Contact (from GET /whatsapp/conversations) ----

export interface WhatsAppContact {
  id: string;
  phone: string;
  name: string | null;
  createdAt: string;
}

// ---- Message (from GET /whatsapp/conversations/{id}/messages) ----

export type WhatsAppMessageDirection = "INBOUND" | "OUTBOUND";

export type WhatsAppMessageType = "text" | "template" | string;

export type WhatsAppMessageStatus =
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | string;

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  direction: WhatsAppMessageDirection;
  from: string;
  to: string;
  body: string;
  messageId: string;
  type: WhatsAppMessageType;
  status: WhatsAppMessageStatus;
  createdAt: string;
}

// ---- Conversation (from GET /whatsapp/conversations) ----

export interface WhatsAppConversation {
  id: string;
  contactId: string;
  lastActivity: string;
  createdAt: string;
  contact: WhatsAppContact;
  messages: WhatsAppMessage[];
}

// ---- Request payloads ----

export interface ReplyToConversationPayload {
  text: string;
}

// ---- Response envelopes ----

export type GetWhatsAppConversationsResponse = ApiResponse<
  WhatsAppConversation[]
>;
export type GetConversationMessagesResponse = ApiResponse<WhatsAppMessage[]>;
export type ReplyToConversationResponse = ApiResponse<WhatsAppMessage>;
