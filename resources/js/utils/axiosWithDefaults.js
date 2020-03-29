import axios from "axios"
// import { loadProgressBar } from 'axios-progress-bar';
// import { history } from '../index';
import configuredStore from '../store/configuredStore';
import { logout } from "../store/auth";

const API_URL =
  process.env.NODE_ENV === "test"
    ? process.env.BASE_URL || `http://localhost:${process.env.PORT}/api/`
    : `/api/`

axios.defaults.baseURL = API_URL
axios.defaults.headers.common.Accept = "application/json"
axios.defaults.headers.common["X-CSRF-TOKEN"] = document
  .querySelector('meta[name="csrf-token"]')
  .content
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      console.warn("interceptor: unauthenticated request")
      history.pushState({}, "Pueblo intranet", "/")
      // configuredStore.dispatch(logout());
    }
    return Promise.reject(error)
  },
)

// loadProgressBar();

export default axios
