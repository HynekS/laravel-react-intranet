import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"

import ServerSyncProvider from "./authenticatedApp/ServerSyncProvider"
import LoginPage from "./login/LoginPage"
import Layout from "./authenticatedApp/Layout"
import { authStatus, fetchUser } from "../store/auth"

import type { AppState } from "./../store/rootReducer"

const HomePage = () => {
  const dispatch = useDispatch()
  const status = useSelector((store: AppState) => store.auth.status)
  useEffect(() => {}, [status])

  if (status === authStatus.INITIAL) dispatch(fetchUser())

  if (status === authStatus.FULFILLED) {
    return (
      <ServerSyncProvider>
        <ToastContainer transition={Slide} />
        <Layout />
      </ServerSyncProvider>
    )
  }
  if (status === authStatus.INITIAL || status === authStatus.PENDING) {
    // Some spinner maybe? 😋
    return null
  }
  return <LoginPage />
}

export default HomePage
