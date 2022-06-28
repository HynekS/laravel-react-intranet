import { toast, DefaultToastOptions } from "react-hot-toast"
import { XIcon, CheckIcon } from "@heroicons/react/outline"
import { css } from "@emotion/react"

const ErrorIcon = () => (
  <div tw="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:(bg-red-800 text-red-200)">
    <XIcon tw="w-6 h-6 stroke-current" />
  </div>
)

const SuccessIcon = () => (
  <div tw="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:(bg-green-800 text-green-200)">
    <CheckIcon tw="w-6 h-6 stroke-current" />
  </div>
)

const animations = css`
  & {
    .animate-enter,
    .animate-leave {
      animation-iteration-count: 1;
      animation-duration: 0.2s;
      animation-timing-function: ease-out;
      animation-delay: 0s;
      animation-iteration-count: 1;
      animation-direction: normal;
      animation-fill-mode: none;
      animation-play-state: running;
      animation-name: enter;
    }
    .animation-enter {
      animation: enter 0.2s ease-out;
    }
    .animation-leave {
      animation: leave 0.2s ease-out;
    }
    @keyframes enter {
      0% {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    .animate-enter {
      animation: enter 0.2s ease-out;
    }
    @keyframes leave {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(0.9);
        opacity: 0;
      }
    }
    .animate-leave {
      animation: leave 0.15s ease-in forwards;
    }
  }
`

const Toast = ({
  type,
  message,
  ...t
}: {
  type: "success" | "error"
  message: string
  visible: boolean
  id: string
}) => {
  return (
    <div css={animations}>
      <div
        className={`${t.visible ? "animate-enter" : "animate-leave"}`}
        id="toast-success"
        tw="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:(text-gray-400 bg-gray-800)"
        role="alert"
      >
        {type === "success" && <SuccessIcon />}
        {type === "error" && <ErrorIcon />}
        <div tw="ml-3 text-sm font-normal">{message}</div>
        <button
          type="button"
          tw="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:(text-gray-900 bg-gray-100) rounded-lg focus:(ring-2 ring-gray-300) p-1.5 inline-flex h-8 w-8 dark:(text-gray-500 bg-gray-800) dark:hover:(text-white bg-gray-700)"
          aria-label="Close"
          onClick={() => toast.dismiss(t.id)}
        >
          <span tw="sr-only">Close</span>
          <XIcon tw="w-5 h-5" fill="currentColor" />
        </button>
      </div>
    </div>
  )
}

const triggerToast = ({
  type,
  message,
  options = {},
  ...props
}: {
  type: "success" | "error"
  message: string
  options?: DefaultToastOptions
}) => toast.custom(t => <Toast {...t} {...{ type, message, ...props }} />, { ...options })

export default triggerToast
