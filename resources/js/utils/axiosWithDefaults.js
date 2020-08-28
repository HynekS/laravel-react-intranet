import axios from "axios"
/*
import { loadProgressBar } from "axios-progress-bar"
import "axios-progress-bar/dist/nprogress.css"

loadProgressBar()
*/
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
      localStorage.removeItem("oauth_token")
      localStorage.removeItem("expires_at")
      history.pushState({}, "Pueblo intranet", "/")
      // TODO force delete user (can not do it via logout because this route is protected)
    }
    return Promise.reject(error)
  },
)

export default axios
