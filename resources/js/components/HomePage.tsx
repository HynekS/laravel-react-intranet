import ServerSyncProvider from "./authenticatedApp/ServerSyncProvider"
import LoginPage from "./login/LoginPage"
import useAuth from "../hooks/useAuth"

const HomePage = () => {
  const { user, loading } = useAuth()

  if (user) {
    return <ServerSyncProvider />
  }
  if (loading) {
    return null
  }
  return <LoginPage />
}

export default HomePage
