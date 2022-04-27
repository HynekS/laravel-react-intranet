import type { AnyAction } from "redux"
import type { akce as Akce } from "../types/model"

/*
  The below object is copied straight from react-base-table source code,
  because importing it caused to include the whole react-base-table
  in the main, 'entry point' bundle.

  Let's try import only the type…
*/
import type { SortOrder } from "react-base-table"

export type Filters = {
  // Is it really? check twice!
  [prop in keyof Akce]?: string
}

type SortBy = {
  key: keyof Akce | null
  order: SortOrder
}

type InitialState = {
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

// Actions
const SET_SORT_BY = (key: SortBy["key"], order: SortOrder) =>
  `[table] updated table sorting (key: ${key}, order: ${order})`
const UPDATE_FILTERS = "[table] updating table filters"
const CLEAR_FILTERS = "[table] all filters have been cleared"

// Reducer
export default function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_SORT_BY(action.key, action.order):
      return {
        ...state,
        sortBy: {
          key: action.key,
          order: action.order,
        },
      }
    case UPDATE_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.filters },
      }
    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {},
      }
    default:
      return state
  }
}

// Action creators
export const setSortBy = ({ key, order }: SortBy) => ({ type: SET_SORT_BY(key, order), key, order })

export const updateFilters = (filters: Filters) => ({ type: UPDATE_FILTERS, filters })

export const clearFilters = () => ({ type: CLEAR_FILTERS })
