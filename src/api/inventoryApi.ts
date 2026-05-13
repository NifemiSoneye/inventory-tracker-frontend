// src/features/inventory/inventoryApiSlice.ts
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";

export interface InventoryItem {
  id: string;
  _id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  status: "In stock" | "Low stock" | "Out of stock";
}

export type CreateItemPayload = Omit<InventoryItem, "_id" | "id" | "status">;
export type UpdateItemPayload = { id: string } & Omit<
  InventoryItem,
  "_id" | "id" | "status"
>;

export interface ItemQueryParams {
  search?: string;
  category?: string;
  status?: "In stock" | "Low stock" | "Out of stock";
}

const itemsAdapter = createEntityAdapter<InventoryItem>();
const initialState = itemsAdapter.getInitialState();

export const inventoryApiSlice = createApi({
  reducerPath: "inventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3500",
    credentials: "include",
  }),
  tagTypes: ["Item"],
  endpoints: (builder) => ({
    getAllItems: builder.query({
      query: (params: ItemQueryParams | void) => ({
        url: "/items",
        params: params ?? {},
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: InventoryItem[]) => {
        const loadedItems = responseData.map((item) => {
          item.id = item._id;
          return item;
        });
        return itemsAdapter.setAll(initialState, loadedItems);
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: "Item" as const, id: "LIST" },
            ...result.ids.map((id) => ({ type: "Item" as const, id })),
          ];
        } else return [{ type: "Item" as const, id: "LIST" }];
      },
    }),

    getItemById: builder.query({
      query: (id: string) => ({
        url: `/items/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: InventoryItem) => {
        responseData.id = responseData._id;
        return responseData;
      },
      providesTags: (result, error, arg) => [
        { type: "Item" as const, id: arg },
      ],
    }),

    createItem: builder.mutation({
      query: (newItem: CreateItemPayload) => ({
        url: "/items",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: [{ type: "Item", id: "LIST" }],
    }),
    getAnalytics: builder.query({
      query: () => "/dashboard",
      providesTags: [{ type: "Item", id: "LIST" }],
    }),

    updateItem: builder.mutation({
      query: ({ id, ...data }: UpdateItemPayload) => ({
        url: `/items/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Item", id: arg.id },
        { type: "Item", id: "LIST" },
      ],
    }),

    deleteItem: builder.mutation({
      query: (id: string) => ({
        url: `/items/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Item", id: arg },
        { type: "Item", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllItemsQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useGetAnalyticsQuery,
} = inventoryApiSlice;

export const selectItemsResult =
  inventoryApiSlice.endpoints.getAllItems.select(undefined);

const selectItemsData = createSelector(
  selectItemsResult,
  (itemsResult) => itemsResult.data,
);

export const {
  selectAll: selectAllItems,
  selectById: selectItemById,
  selectIds: selectItemIds,
} = itemsAdapter.getSelectors(
  (state: RootState) => selectItemsData(state) ?? initialState,
);
