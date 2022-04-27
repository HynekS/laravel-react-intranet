import client from "../utils/axiosWithDefaults"
import { updates as Update } from "@/types/model"

const FETCH_LAST_UPDATE_ID_INITIALIZED = "[updates] fetching the last update ID was initialized"
const FETCH_LAST_UPDATE_ID_SUCCESS = "[updates] fetching the last update ID was successfull"
const FETCH_LAST_UPDATE_ID_FAILURE = "[updates] fetching the last update ID has failed"

const FETCH_LAST_MONTH_UPDATES_INITIALIZED =
  "[updates] fetching updates from last month was initialized"
const FETCH_LAST_MONTH_UPDATES_SUCCESS =
  "[updates] fetching updates from last month was successfull"
const FETCH_LAST_MONTH_UPDATES_FAILURE = "[updates] fetching updates from last month has failed"

export const updatesStatus = {
  ID: {
    IDLE: "idle",
    FETCHING: "fetching",
    ERROR: "error",
  },
  LATEST_UPDATES: {
    IDLE: "idle",
    FETCHING: "fetching",
    ERROR: "error",
  },
} as const

type InitialState = {
  latestId: number | null
  latestUpdates: Update[]
  error: { ID: null | Error; LATEST_UPDATES: null | Error } // should be part of status? Probably should be object, as status is
  status: {
    ID: typeof updatesStatus.ID[keyof typeof updatesStatus.ID]
    LATEST_UPDATES: typeof updatesStatus.LATEST_UPDATES[keyof typeof updatesStatus.LATEST_UPDATES]
  }
}

const initialState: InitialState = {
  latestId: null,
  latestUpdates: [],
  error: { ID: null, LATEST_UPDATES: null },
  status: {
    ID: updatesStatus.ID.IDLE,
    LATEST_UPDATES: updatesStatus.LATEST_UPDATES.IDLE,
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_LAST_UPDATE_ID_INITIALIZED:
      return {
        ...state,
        error: {
          ID: null,
          LATEST_UPDATES: null,
        },
        status: {
          ...state.status,
          ID: updatesStatus.ID.FETCHING,
        },
      }
    case FETCH_LAST_MONTH_UPDATES_INITIALIZED:
      return {
        ...state,
        error: {
          ID: null,
          LATEST_UPDATES: null,
        },
        status: {
          ...state.status,
          LATEST_UPDATES: updatesStatus.LATEST_UPDATES.FETCHING,
        },
      }
    case FETCH_LAST_UPDATE_ID_SUCCESS:
      return {
        ...state,
        latestId: action.latestId,
        status: {
          ...state.status,
          ID: updatesStatus.ID.IDLE,
        },
      }
    case FETCH_LAST_MONTH_UPDATES_SUCCESS:
      return {
        ...state,
        latestUpdates: action.latestUpdates,

        status: {
          ...state.status,
          LATEST_UPDATES: updatesStatus.LATEST_UPDATES.IDLE,
        },
      }
    case FETCH_LAST_UPDATE_ID_FAILURE:
      return {
        ...state,
        error: {
          ...state.error,
          ID: action.error,
        },
        status: {
          ...state.status,
          ID: updatesStatus.ID.IDLE,
        },
      }
    case FETCH_LAST_MONTH_UPDATES_FAILURE:
      return {
        ...state,
        error: {
          ...state.error,
          LATEST_UPDATES: action.error,
        },
        status: {
          ...state.status,
          LATEST_UPDATES: updatesStatus.LATEST_UPDATES.IDLE,
        },
      }
    default:
      return state
  }
}

export const fetchLastUpdateIdInit = () => ({
  type: FETCH_LAST_UPDATE_ID_INITIALIZED,
})

export const fetchLastUpdateIdSuccess = latestId => ({
  type: FETCH_LAST_UPDATE_ID_SUCCESS,
  latestId,
})

export const fetchLastUpdateIdFailure = (error: Error) => ({
  type: FETCH_LAST_UPDATE_ID_FAILURE,
  error,
})

export const fetchLastMonthUpdatesInit = () => ({
  type: FETCH_LAST_MONTH_UPDATES_INITIALIZED,
})

export const fetchLastMonthUpdatesSuccess = latestUpdates => ({
  type: FETCH_LAST_MONTH_UPDATES_SUCCESS,
  latestUpdates,
})

export const fetchLastMonthUpdatesFailure = (error: Error) => ({
  type: FETCH_LAST_MONTH_UPDATES_FAILURE,
  error,
})

export const fetchLatestUpdateId = () => async dispatch => {
  dispatch(fetchLastUpdateIdInit())
  try {
    const latestId = await client("/updates/latest_id")
    dispatch(fetchLastUpdateIdSuccess(latestId))
  } catch (err) {
    console.log(err)
    dispatch(fetchLastUpdateIdFailure(err as Error))
  }
}

export const fetchLastMonthUpdates = () => async dispatch => {
  dispatch(fetchLastMonthUpdatesInit())
  try {
    const latestUpdates = await client("/updates/get_last_month")
    dispatch(fetchLastMonthUpdatesSuccess(latestUpdates))
  } catch (err) {
    console.log(err)
    dispatch(fetchLastMonthUpdatesFailure(err as Error))
  }
}
