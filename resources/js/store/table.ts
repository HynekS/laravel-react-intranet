import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { SortOrder } from "react-base-table"

import type { akce as Akce } from "../types/model"

export type Filters = {
  [key in keyof Akce]?: string
}

type SortBy = {
  key: keyof Akce | null
  order: SortOrder
}

interface InitialState {
  sortBy: SortBy
  filters: Filters
}

const initialState: InitialState = {
  sortBy: {
    key: null,
    order: "asc",
  },
  filters: {},
}

export const tableSlice = createSlice({
  name: "name",
  initialState,
  reducers: {
    setSortBy: (state, { payload }: PayloadAction<{ key: SortBy["key"]; order: SortOrder }>) => {
      return {
        ...state,
        sortBy: {
          key: payload.key,
          order: payload.order,
        },
      }
    },
    updateFilters: (state, { payload }: PayloadAction<Filters>) => {
      return {
        ...state,
        filters: { ...state.filters, ...payload },
      }
    },
    clearFilters: state => {
      return {
        ...state,
        filters: {},
      }
    },
  },
})

export const { setSortBy, updateFilters, clearFilters } = tableSlice.actions

export default tableSlice.reducer
