import React from "react"
import ReactModal from "react-modal"
import styled from "@emotion/styled"

ReactModal.setAppElement("#app")

function ReactModalAdapter({ className, ...props }) {
  const contentClassName = `${className}__content`
  const overlayClassName = `${className}__overlay`
  return (
    <ReactModal
      portalClassName={className}
      className={contentClassName}
      overlayClassName={overlayClassName}
      {...props}
    />
  )
}

const StyledReactModal = styled(ReactModalAdapter)`
  &__overlay {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    &.ReactModal__Overlay {
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 300ms ease-out;
    }
    &.ReactModal__Overlay--after-open {
      opacity: 1;
    }
    &.ReactModal__Overlay--before-close {
      opacity: 0;
      transition: opacity 200ms ease-out;
    }
  }

  &__content {
    position: absolute;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    background: #fff;
    overflow: auto;
    border-radius: 4px;
    outline: none;
    padding: 20px;
    &.ReactModal__Content {
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
      transform: translateY(1rem);
      transition: transform 300ms ease-out;
      -webkit-overflow-scrolling: touch;
    }

    &.ReactModal__Content--after-open {
      transform: translateY(0);
    }

    &.ReactModal__Content--before-close {
      transform: translateY(1rem);
      transition: transform 200ms ease-out;
    }
  }
`
export default StyledReactModal
