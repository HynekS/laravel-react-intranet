/** @jsx jsx */
import React from "react"
import { css, jsx } from "@emotion/core"

import LoginForm from "./LoginForm"

const LoginPage = props => {
  return (
    <div
      css={css`
        background-image: url(/images/noise.svg), url(/images/jar-with-handle.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50% 50%;
        box-shadow: inset 0 0 8rem rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100vh;
        &:after {
          content: "\A";
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.6);
        }
      `}
    >
      <LoginForm />
    </div>
  )
}

export default LoginPage
