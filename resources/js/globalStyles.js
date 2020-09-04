export default function globalStyles(props) {
  return `html {
    color: #555;
    overflow-y: overlay;
    -ms-overflow-style: -ms-autohiding-scrollbar;
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
}
