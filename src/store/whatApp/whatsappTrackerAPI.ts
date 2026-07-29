import { baseAPI } from "../BaseApi/baseAPI";
import {
  GetConversationMessagesResponse,
  GetWhatsAppConversationsResponse,
  ReplyToConversationPayload,
  ReplyToConversationResponse,
} from "./types/whatsappTrackerTypes";

export const whatsappTrackerAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getWhatsAppConversations: build.query<
      GetWhatsAppConversationsResponse,
      void
    >({
      query: () => ({
        url: `/whatsapp/conversations`,
        method: "GET",
      }),
      providesTags: ["WhatsAppConversation"],
    }),
    getConversationMessages: build.query<
      GetConversationMessagesResponse,
      string
    >({
      query: (id) => ({
        url: `/whatsapp/conversations/${id}/messages`,
        method: "GET",
      }),
      providesTags: ["WhatsAppConversation"],
    }),
    replyToConversation: build.mutation<
      ReplyToConversationResponse,
      { id: string; data: ReplyToConversationPayload }
    >({
      query: ({ id, data }) => ({
        url: `/whatsapp/conversations/${id}/reply`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WhatsAppConversation"],
    }),
  }),
});

export const {
  useGetWhatsAppConversationsQuery,
  useGetConversationMessagesQuery,
  useReplyToConversationMutation,
} = whatsappTrackerAPI;
