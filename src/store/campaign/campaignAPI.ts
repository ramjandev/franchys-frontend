import { baseAPI } from "../BaseApi/baseAPI";
import {
  CreateCampaign,
  CreateCampaignResponse,
  GetCampaignByIdResponse,
  GetCampaignsResponse,
  SendCampaignResponse,
  UpdateCampaign,
  UpdateCampaignResponse,
  ValidateCampaignCodePayload,
  ValidateCampaignCodeResponse,
} from "./types/campaignTypes";

export const campaignAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createCampaign: build.mutation<CreateCampaignResponse, CreateCampaign>({
      query: (data) => ({
        url: `/campaign`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Campaign"],
    }),
    getCampaigns: build.query<GetCampaignsResponse, void>({
      query: () => ({
        url: `/campaign`,
        method: "GET",
      }),
      providesTags: ["Campaign"],
    }),
    getCampaignById: build.query<GetCampaignByIdResponse, string>({
      query: (id) => ({
        url: `/campaign/${id}`,
        method: "GET",
      }),
      providesTags: ["Campaign"],
    }),
    updateCampaign: build.mutation<
      UpdateCampaignResponse,
      { id: string; data: UpdateCampaign }
    >({
      query: ({ id, data }) => ({
        url: `/campaign/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Campaign"],
    }),
    deleteCampaign: build.mutation<void, string>({
      query: (id) => ({
        url: `/campaign/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaign"],
    }),
    validateCampaignCode: build.mutation<
      ValidateCampaignCodeResponse,
      ValidateCampaignCodePayload
    >({
      query: (data) => ({
        url: `/campaign/validate-code`,
        method: "POST",
        body: data,
      }),
    }),
    sendCampaign: build.mutation<SendCampaignResponse, string>({
      query: (id) => ({
        url: `/campaign/${id}/send`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Campaign"],
    }),
  }),
});

export const {
  useCreateCampaignMutation,
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useValidateCampaignCodeMutation,
  useSendCampaignMutation,
} = campaignAPI;
