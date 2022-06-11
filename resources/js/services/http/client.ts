import axios from "axios"
import createAuthRefreshInterceptor from "axios-auth-refresh"

import store from "@store/configuredStore"
import { fetchUserFailure } from "@store/auth"

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
axios.defaults.withCredentials = true

const refreshAuthLogic = () =>
  axios
    .get("auth/refresh-token")
    .then(tokenRefreshResponse => {
      axios.defaults.headers["Authorization"] = "Bearer " + tokenRefreshResponse.data.access_token
      return Promise.resolve()
    })
    .catch(e => {
      store.dispatch(fetchUserFailure(e))
      history.pushState({}, "Pueblo intranet", "/")
      return Promise.reject(e)
    })

createAuthRefreshInterceptor(axios, refreshAuthLogic)

axios.interceptors.response.use(
  response => response,
  async error => {
    const request = error.config

    if (error && error.response && error.response.status === 401) {
      // let's retry
      return axios(request)
    }
    throw error
  },
)

export default axios
