import { baseAPI } from "@/store/BaseApi/baseAPI";
import {
  GetMeResponse,
  GetProfileShopResponse,
  UpdateProfileShopResponse,
  UpdateUserProfileResponse,
} from "./types/profileShopTypes";

export const profileShopAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getProfileShop: build.query<GetProfileShopResponse, void>({
      query: () => ({
        url: `/profile-shop`,
        method: "GET",
      }),
      providesTags: ["ProfileShop"],
    }),

    updateProfileShop: build.mutation<UpdateProfileShopResponse, FormData>({
      query: (data) => ({
        url: `/profile-shop`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ProfileShop"],
    }),

    getMe: build.query<GetMeResponse, void>({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
      }),
      providesTags: ["Me"],
    }),

    updateUserProfile: build.mutation<UpdateUserProfileResponse, FormData>({
      query: (data) => ({
        url: `/users/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useGetProfileShopQuery,
  useUpdateProfileShopMutation,
  useGetMeQuery,
  useUpdateUserProfileMutation,
} = profileShopAPI;
