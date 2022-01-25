import axios from "axios"

import store from "../store/configuredStore"
import { clearLoggedInUser } from "../store/auth"

const API_URL =
  process.env.NODE_ENV === "test"
    ? process.env.BASE_URL || `http://localhost:${process.env.PORT}/api/`
    : `/api/`

axios.defaults.baseURL = API_URL
axios.defaults.headers.common.Accept = "application/json"
axios.defaults.headers.common["X-CSRF-TOKEN"] = document.querySelector<HTMLMetaElement>(
  'meta[name="csrf-token"]',
)?.content
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("oauth_token")
      localStorage.removeItem("expires_at")
      store.dispatch(clearLoggedInUser())
      history.pushState({}, "Pueblo intranet", "/")
    }
    return Promise.reject(error)
  },
)

export default axios
