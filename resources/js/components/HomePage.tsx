import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"

import ServerSyncProvider from "./authenticatedApp/ServerSyncProvider"
import LoginPage from "./login/LoginPage"
import Layout from "./authenticatedApp/Layout"
import useAuth from "../hooks/useAuth"

const HomePage = () => {
  const { user, loading } = useAuth()

  if (user) {
    return (
      <ServerSyncProvider>
        <ToastContainer transition={Slide} />
        <Layout />
      </ServerSyncProvider>
    )
  }
  if (loading) {
    return null
  }
  return <LoginPage />
}

export default HomePage
