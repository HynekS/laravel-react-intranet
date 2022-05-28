import client from "../utils/axiosWithDefaults"

export const authStatus = {
  INITIAL: "initial",
  PENDING: "pending",
  REJECTED: "rejected",
  FULFILLED: "fulfilled",
} as const

type TypeAuthStatus = typeof authStatus
type AuthStatus = TypeAuthStatus[keyof TypeAuthStatus]

const initialState = {
  status: authStatus.INITIAL,
  isAuthPending: false,
  authError: null,
  isUserBeingFetched: false,
  userError: null,
  user: null,
  isLogoutPending: false,
  logoutError: null,
}

// Actions
const LOGIN_INITIALIZED = "[auth] Login was initialized"
const LOGIN_SUCCESS = "[auth] Login was succesful"
const LOGIN_FAILURE = "[auth] Login has failed"

const FETCH_USER_INITIALIZED = "[auth] Fetching user has started"
const FETCH_USER_SUCCESS = "[auth] Fetching user was succesful"
const FETCH_USER_FAILURE = "[auth] Fetching user has failed"

const LOGOUT_INITIALIZED = "[auth] Logout was initialized"
const LOGOUT_SUCCESS = "[auth] Logout was succesful"
const LOGOUT_FAILURE = "[auth] Logout has failed"

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_INITIALIZED:
      return {
        ...state,
        authError: null,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        status: authStatus.FULFILLED,
        user: action.user,
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        authError: action.error,
      }
    case FETCH_USER_INITIALIZED:
      return {
        ...state,
        authStatus: authStatus.PENDING,
      }
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        status: authStatus.FULFILLED,
        user: action.user,
      }
    case FETCH_USER_FAILURE:
      return {
        ...state,
        status: authStatus.REJECTED,
        userError: action.error,
      }
    case LOGOUT_INITIALIZED:
      return {
        ...state,
        isLogoutPending: true,
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        status: authStatus.REJECTED,
        isLogoutPending: false,
        user: null,
      }
    case LOGOUT_FAILURE:
      return {
        ...state,
        isLogoutPending: false,
        logoutError: action.error,
      }
    default:
      return state
  }
}

// Action creators
export const loginInit = () => ({ type: LOGIN_INITIALIZED })

export const loginSuccess = user => ({ type: LOGIN_SUCCESS, user })

export const loginFailure = error => ({ type: LOGIN_FAILURE, error })

export const fetchUserInit = () => ({ type: FETCH_USER_INITIALIZED })

export const fetchUserSuccess = user => ({ type: FETCH_USER_SUCCESS, user })

export const fetchUserFailure = error => ({ type: FETCH_USER_FAILURE, error })

export const logoutInit = () => ({ type: LOGOUT_INITIALIZED })

export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS })

export const logoutFailure = error => ({ type: LOGOUT_FAILURE, error })

// Thunks
export const submitLoginData = credentials => async dispatch => {
  dispatch(loginInit())
  try {
    const response = await client.post("auth/login", {
      ...credentials,
    })
    client.defaults.headers["Authorization"] = `Bearer ${response.data.access_token}`

    dispatch(loginSuccess(response.data.user))
  } catch (error) {
    dispatch(loginFailure(error.response.data))
  }
}

export const fetchUser = () => async dispatch => {
  try {
    dispatch(fetchUserInit())
    const response = await client.get("auth/user")
    if (response) dispatch(fetchUserSuccess(response.data))
  } catch (e) {
    dispatch(fetchUserFailure(e))
  }
}

export const logout = navigate => async dispatch => {
  try {
    dispatch(logoutInit())
    const response = await client.get("auth/logout")
    if (response) {
      dispatch(logoutSuccess())
      navigate("/")
    }
  } catch (e) {
    dispatch(logoutFailure(e))
  }
}
