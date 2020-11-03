// @ts-check
import React from "react"

import Layout from "../components/authenticatedApp/Layout"
import LoginPage from "./login/LoginPage"
import useAuth from "../utils/useAuth"

const HomePage = props => {
  const { user, loading } = useAuth()

  if (user) {
    return <Layout />
  }
  if (loading) {
    return null
  }
  return <LoginPage />
}

export default HomePage
