import { useEffect } from "react"
import { Toaster } from "react-hot-toast"

import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import ServerSyncProvider from "./ServerSyncProvider"
import LoginPage from "./views/login/LoginPage"
import Layout from "./layout/Layout"
import { fetchUser } from "@store/auth"

const HomePage = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(store => store.auth.status)
  useEffect(() => {
    if (status === "idle") dispatch(fetchUser())
  }, [status])

  if (status === "fulfilled") {
    return (
      <ServerSyncProvider>
        <Toaster position="bottom-right" />
        <Layout />
      </ServerSyncProvider>
    )
  }
  if (status === "idle" || status === "refreshing") {
    return null
  }
  return <LoginPage />
}

export default HomePage
