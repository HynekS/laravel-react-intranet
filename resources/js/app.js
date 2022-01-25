import React from "react"
import { BrowserRouter } from "react-router-dom"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { GlobalStyles } from "twin.macro"
import { Global } from "@emotion/react"

import configuredStore from "./store/configuredStore"
import { checkForValidToken } from "./store/auth"
import globalStyles from "./globalStyles"

configuredStore.dispatch(checkForValidToken())

import HomePage from "./components/HomePage"

const App = () => {
  return (
    <Provider store={configuredStore}>
      <BrowserRouter>
        <GlobalStyles />
        <Global styles={globalStyles} />
        <HomePage />
      </BrowserRouter>
    </Provider>
  )
}

export default App

if (document.getElementById("app")) {
  render(<App />, document.getElementById("app"))
}

if (module.hot) {
  console.log("HMR enabled")
  module.hot.accept()
}
