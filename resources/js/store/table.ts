import { Filters } from "./table.d"

/*
  The below object is copied straight from react-base-table source code,
  because importing it caused to include the whole react-base-table
  in the main, 'entry point' bundle
*/

const SortOrder = {
  ASC: "asc",
  DESC: "desc",
}

const initialState = {
  sortBy: {
    key: null,
    order: SortOrder.ASC,
  },
  filters: <Filters>{},
}

// Actions
const SET_SORT_BY = (key, order) => `[table] updated table sorting (key: ${key}, order: ${order})`
const UPDATE_FILTERS = "[table] updating table filters"
const CLEAR_FILTERS = "[table] all filters have been cleared"

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_SORT_BY(action.key, action.order):
      return {
        ...state,
        sortBy: { key: action.key, order: action.order },
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
export const setSortBy = ({ key, order }) => ({ type: SET_SORT_BY(key, order), key, order })

export const updateFilters = filters => ({ type: UPDATE_FILTERS, filters })

export const clearFilters = () => ({ type: CLEAR_FILTERS })
