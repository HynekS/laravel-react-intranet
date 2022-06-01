import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Toaster } from "react-hot-toast"

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
        <Toaster position="bottom-right" />
        <Layout />
      </ServerSyncProvider>
    )
  }
  if (status === authStatus.INITIAL || status === authStatus.PENDING) {
    return null
  }
  return <LoginPage />
}

export default HomePage
