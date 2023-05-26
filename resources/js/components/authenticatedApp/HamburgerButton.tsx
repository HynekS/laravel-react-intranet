import { css } from "@emotion/react"

const HamburgerButton = ({
  onClick,
  isOpen,
  ...props
}: {
  onClick: () => void
  isOpen: boolean
  props?: any
}) => {
  const hamburgerButtonStyles = css`
    width: calc(60px / 2);
    height: calc(45px / 2);
    background-color: transparent;
    border: none;
    position: relative;
    transform: rotate(0deg);
    cursor: pointer;
    z-index: 10;

    & span {
      display: block;
      position: absolute;
      height: calc(6px / 2);
      width: 100%;
      background: currentcolor;
      border-radius: calc(6px / 2);
      opacity: 1;
      left: 0;
      transform: rotate(0deg);
      transition: 0.25s ease-in-out;
      margin: 0;
      padding: 0;

      &:nth-of-type(1) {
        top: 0px;
      }

      &:nth-of-type(2),
      &:nth-of-type(3) {
        top: calc(18px / 2);
      }

      &:nth-of-type(4) {
        top: calc(36px / 2);
      }
    }

    &.open span {
      &:nth-of-type(1) {
        top: calc(18px / 2);
        width: 0%;
        left: 50%;
      }
      &:nth-of-type(2) {
        transform: rotate(45deg);
      }
      &:nth-of-type(3) {
        transform: rotate(-45deg);
      }
      &:nth-of-type(4) {
        top: calc(18px / 2);
        width: 0%;
        left: 50%;
      }
    }
  `

  return (
    <div {...props}>
      <button
        className={`hamburgerMenu ${isOpen && `open`}`.trim()}
        css={hamburgerButtonStyles}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span />
        <span />
        <span />
        <span />
      </button>
    </div>
  )
}

export default HamburgerButton
