import { css } from "twin.macro"

const globalStyles = css`
  html,
  body,
  #app {
    height: 100%;
    margin: 0;
  }

  html {
    color: #4a5568;
    overflow-y: overlay;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  input[type="checkbox"]:checked {
    background-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTYgMTYnIGZpbGw9JyNmZmYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZD0nTTEyLjIwNyA0Ljc5M2ExIDEgMCAwIDEgMCAxLjQxNGwtNSA1YTEgMSAwIDAgMS0xLjQxNCAwbC0yLTJhMSAxIDAgMCAxIDEuNDE0LTEuNDE0TDYuNSA5LjA4Nmw0LjI5My00LjI5M2ExIDEgMCAwIDEgMS40MTQgMHonLz48L3N2Zz4=);
    background-size: 125%;
  }

  .spinner {
    position: relative;
    color: transparent !important;
    pointer-events: none;
  }

  .spinner::after {
    content: "";
    position: absolute !important;
    top: calc(50% - (1em / 2));
    left: calc(50% - (1em / 2));
    display: block;
    width: 1em;
    height: 1em;
    border: 2px solid #fff;
    border-radius: 9999px;
    border-right-color: transparent;
    border-top-color: transparent;
    animation: spinAround 500ms infinite linear;
  }

  @keyframes spinAround {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
export default globalStyles
