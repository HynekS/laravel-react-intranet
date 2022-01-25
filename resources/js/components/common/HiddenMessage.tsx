import { Transition } from "react-transition-group"

type Props = {
  children: React.ReactNode
  show: unknown
  duration: number
}

const HiddenMessage = ({ show, children, duration = 400, ...props }: Props) => {
  const defaultStyle: React.CSSProperties = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
    visibility: `hidden`,
  }

  const setEnteringStyles = (node: HTMLElement) => {
    node.style.visibility = "visible"
  }

  const setEnteredStyles = (node: HTMLElement) => {
    node.style.opacity = "1"
  }

  const setExitingStyle = (node: HTMLElement) => {
    node.style.opacity = "0"
  }

  const setExitedStyle = (node: HTMLElement) => {
    node.style.visibility = "hidden"
  }

  return (
    <Transition
      {...props}
      onEntering={(node: HTMLElement) => setEnteringStyles(node)}
      onEntered={(node: HTMLElement) => setEnteredStyles(node)}
      onExiting={(node: HTMLElement) => setExitingStyle(node)}
      onExited={(node: HTMLElement) => setExitedStyle(node)}
      in={Boolean(show)}
      timeout={duration}
    >
      <div style={{ ...defaultStyle }}>{children}</div>
    </Transition>
  )
}

export default HiddenMessage
