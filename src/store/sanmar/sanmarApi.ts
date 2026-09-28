import { baseAPI } from "../BaseApi/baseAPI";
import {
  SanmarAutocompleteParams,
  SanmarProductAutocompleteResponse,
  SanmarSyncSftpResponse,
} from "./types/sanmarTypes";

export const sanmarApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSanmarProductsAutocomplete: build.query<
      SanmarProductAutocompleteResponse,
      SanmarAutocompleteParams | void
    >({
      query: (params) => ({
        url: `/sanmar/products/autocomplete`,
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Sanmar"],
    }),
    syncSanmarSftp: build.mutation<SanmarSyncSftpResponse, void>({
      query: () => ({
        url: `/sanmar/sync-sftp`,
        method: "POST",
      }),
      invalidatesTags: ["Sanmar"],
    }),
  }),
});

export const {
  useGetSanmarProductsAutocompleteQuery,
  useLazyGetSanmarProductsAutocompleteQuery,
  useSyncSanmarSftpMutation,
} = sanmarApi;
