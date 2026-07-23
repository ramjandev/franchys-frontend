import { baseAPI } from "../BaseApi/baseAPI";
import {
  GetEmailThreadsResponse,
  GetThreadMessagesResponse,
  ReplyToThreadPayload,
  ReplyToThreadResponse,
  StartWatchResponse,
} from "./types/emailTrackerTypes";

export const emailTrackerAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    startWatch: build.query<StartWatchResponse, void>({
      query: () => ({
        url: `/emails/start-watch`,
        method: "GET",
      }),
    }),
    getEmailThreads: build.query<GetEmailThreadsResponse, void>({
      query: () => ({
        url: `/emails/threads`,
        method: "GET",
      }),
      providesTags: ["EmailThread"],
    }),
    getThreadMessages: build.query<GetThreadMessagesResponse, string>({
      query: (id) => ({
        url: `/emails/threads/${id}/messages`,
        method: "GET",
      }),
      providesTags: ["EmailThread"],
    }),
    replyToThread: build.mutation<
      ReplyToThreadResponse,
      { id: string; data: ReplyToThreadPayload }
    >({
      query: ({ id, data }) => ({
        url: `/emails/threads/${id}/reply`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EmailThread"],
    }),
  }),
});

export const {
  useLazyStartWatchQuery,
  useGetEmailThreadsQuery,
  useGetThreadMessagesQuery,
  useReplyToThreadMutation,
} = emailTrackerAPI;
