import React from "react"
import ReactModal from "react-modal"
import styled from "@emotion/styled"
import tw from "twin.macro"

ReactModal.setAppElement("#app")

function ReactModalAdapter({ className = "", ...props }) {
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
    ${tw`fixed inset-0 z-30 flex items-center justify-center pb-8 lg:(pb-16)`}
    &.ReactModal__Overlay {
      background-color: rgba(113, 128, 150, 0.75);
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
    ${tw`bg-white rounded-lg p-4 z-40 max-w-screen-sm lg:(max-w-6xl w-1/2 p-6 pt-4)`};
    outline: none;
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
