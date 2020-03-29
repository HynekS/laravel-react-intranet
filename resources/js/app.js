import React from "react"
import { BrowserRouter } from "react-router-dom"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { Global, css } from "@emotion/core"
import "tailwindcss/dist/base.css"

import configuredStore from "./store/configuredStore"
import { checkForValidToken } from "./store/auth"

configuredStore.dispatch(checkForValidToken())

import HomePage from "./components/HomePage"

const App = () => {
  return (
    <Provider store={configuredStore}>
      <BrowserRouter>
        <Global
          styles={css`
            html {
              overflow-y: overlay;
              -ms-overflow-style: -ms-autohiding-scrollbar;
            }
          `}
        />
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
