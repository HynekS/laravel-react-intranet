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

type ScrollState = {
  [key: string]: number
}

interface InitialState {
  sortBy: SortBy
  filters: Filters
  scrollState: ScrollState
}

const initialState: InitialState = {
  sortBy: {
    key: null,
    order: "asc",
  },
  filters: {},
  scrollState: {},
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
    updateScrollState: (state, { payload }: PayloadAction<ScrollState>) => {
      return {
        ...state,
        scrollState: { ...state.scrollState, ...payload },
      }
    },
  },
})

export const { setSortBy, updateFilters, clearFilters, updateScrollState } = tableSlice.actions

export default tableSlice.reducer
