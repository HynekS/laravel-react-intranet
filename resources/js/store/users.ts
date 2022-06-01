// @ts-check
import client from "../utils/axiosWithDefaults"

const initialState = {
  isFetchingActiveUsersList: false,
  isFetchingActiveUsersListError: null,
  activeUsers: [],
}

// Actions
const FETCH_ACTIVE_USERS_LIST_INITIALIZED = "[users] fetching the list of users was initialized"
const FETCH_ACTIVE_USERS_LIST_SUCCESS = "[users] fetching the list of users was successful"
const FETCH_ACTIVE_USERS_LIST_FAILURE = "[users] fetching the list of users has failed"

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_ACTIVE_USERS_LIST_INITIALIZED:
      return {
        ...state,
        isFetchingActiveUsersList: true,
      }
    case FETCH_ACTIVE_USERS_LIST_SUCCESS:
      return {
        ...state,
        isFetchingActiveUsersList: false,
        activeUsers: action.users,
      }
    case FETCH_ACTIVE_USERS_LIST_FAILURE:
      return {
        ...state,
        isFetchingActiveUsersList: false,
        isFetchingActiveUsersListError: action.error,
      }
    default:
      return state
  }
}

// Action creators
export const fetchActiveUsersInit = () => ({ type: FETCH_ACTIVE_USERS_LIST_INITIALIZED })

export const fetchActiveUsersSuccess = users => ({ type: FETCH_ACTIVE_USERS_LIST_SUCCESS, users })

export const fetchActiveUsersFailure = error => ({ type: FETCH_ACTIVE_USERS_LIST_FAILURE, error })

// Thunks
export const fetchActiveUsers = () => async dispatch => {
  try {
    dispatch(fetchActiveUsersInit())
    const response = await client.get("users/get_active")
    if (response) {
      dispatch(fetchActiveUsersSuccess(response.data))
    }
  } catch (error) {
    console.log(error)
    dispatch(fetchActiveUsersFailure(error))
  }
}
