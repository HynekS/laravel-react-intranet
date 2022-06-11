import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Toaster } from "react-hot-toast"

import ServerSyncProvider from "./authenticatedApp/ServerSyncProvider"
import LoginPage from "./login/LoginPage"
import Layout from "./authenticatedApp/Layout"
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
