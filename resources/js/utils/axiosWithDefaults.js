// changed from es6 import to supress TS errors:
 const { default: axios } = require('axios');

import store from "../store/configuredStore"
import { clearLoggedInUser } from "../store/auth"

const API_URL =
  process.env.NODE_ENV === "test"
    ? process.env.BASE_URL || `http://localhost:${process.env.PORT}/api/`
    : `/api/`

axios.defaults.baseURL = API_URL
axios.defaults.headers.common.Accept = "application/json"
axios.defaults.headers.common["X-CSRF-TOKEN"] = document.querySelector(
  'meta[name="csrf-token"]',
).content
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      /* This is not working as expected. It gives an impossible state when token is invalidated,
       but the user is logged in (but can't do anything because of these 401s).
       It is because of deletion of tokens to prevent bloat the db table, but if a user logs in on multiple devices,
       it causes this bug. */
      localStorage.removeItem("oauth_token")
      localStorage.removeItem("expires_at")
      store.dispatch(clearLoggedInUser())
      history.pushState({}, "Pueblo intranet", "/")
    }
    return Promise.reject(error)
  },
)

export default axios
