import { baseAPI } from "../BaseApi/baseAPI";
import { SendCampaignPayload } from "./types/campaignTypes";

export const campaignAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    sendCampaign: build.mutation<void, SendCampaignPayload>({
      query: (data) => ({
        url: `/campaign/send-promotional-email`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Campaign"],
    }),
  }),
});

export const { useSendCampaignMutation } = campaignAPI;
