import { css } from "@emotion/react"

import LoginForm from "./LoginForm"

const LoginPage = () => {
  return (
    <div
      css={css`
        background-image: url(/images/noise.svg), url(/images/demo-app-login-background-lowres.jpg);
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
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.4);
        }
      `}
    >
      <LoginForm />
    </div>
  )
}

export default LoginPage
