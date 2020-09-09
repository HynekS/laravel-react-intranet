import React from "react"
import ReactModal from "react-modal"
// import styled from "@emotion/styled"
import "./StyledModal.css"

ReactModal.setAppElement("#app")

/*
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
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 500ms ease-in-out;
    &.ReactModal__Overlay--after-open {
      opacity: 1;
    }
    &.ReactModal__Overlay--before-close {
      opacity: 0;
    }
  }

  &__content {
    position: absolute;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
    background: #fff;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 4px;
    outline: none;
    padding: 20px;
    transition: transform 500ms ease-in-out;
    transform: translateY(100px);
    &.ReactModal__Content--after-open {
      transform: translateY(0px);
    }
    &.ReactModal__Content--before-close {
      transform: translateY(100px);
    }
  }
`
*/
// export default StyledReactModal

ReactModal.defaultStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(74, 85, 104, 0.75)'
  },
  content: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px'
  }
}


export default ReactModal
