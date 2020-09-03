import React from "react"
import { BrowserRouter } from "react-router-dom"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { ModalProvider } from "react-modal-hook"
import { Global, css } from "@emotion/core"
import "tailwindcss/dist/base.min.css"

import configuredStore from "./store/configuredStore"
import { checkForValidToken } from "./store/auth"
import globalStyles from "./globalStyles"

configuredStore.dispatch(checkForValidToken())

import HomePage from "./components/HomePage"

const App = () => {
  return (
    <Provider store={configuredStore}>
      <BrowserRouter>
        <Global
          styles={css`
            ${globalStyles()}
          `}
        />
        <HomePage />
      </BrowserRouter>
    </Provider>
  )
}

export default App

if (document.getElementById("app")) {
  render(
    <ModalProvider>
      <App />
    </ModalProvider>,
    document.getElementById("app"),
  )
}

if (module.hot) {
  console.log("HMR enabled")
  module.hot.accept()
}
