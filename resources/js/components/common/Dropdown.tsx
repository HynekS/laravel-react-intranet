import { useState, ElementType, ReactNode, MouseEventHandler } from "react"
import tw from "twin.macro"

import { DotsHorizontalIcon } from "@heroicons/react/solid"

import useOuterClick from "../../hooks/useOuterClick"

type DropdownItemProps = {
  onClick: MouseEventHandler<HTMLButtonElement>
  Icon: ElementType
  label: string
} & JSX.IntrinsicElements["button"]

type DropdownProps = {
  button: ElementType
  children: ReactNode
} & JSX.IntrinsicElements["div"]

export const DropdownItem = ({ onClick, Icon, label, ...props }: DropdownItemProps) => {
  return (
    <button
      tw="font-medium flex items-center w-full p-2 pr-4 rounded first-of-type:(rounded-b-none) last-of-type:(rounded-t-none) focus:(outline-none) hocus:(bg-gray-200 text-gray-900) transition-colors duration-300"
      onClick={onClick}
      type="button"
      aria-label={label}
      {...props}
    >
      {Icon ? <Icon tw="flex w-5 mr-2 opacity-50" /> : null}
      {label}
    </button>
  )
}

export const Dropdown = ({ children, button, ...props }: DropdownProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const Button = button

  const innerRef = useOuterClick<HTMLDivElement>(() => {
    setIsMenuOpen(false)
  })

  return (
    <div ref={innerRef} tw="relative px-2 height[max-content]  self-start" {...props}>
      <button
        tw="flex items-center pl-2"
        onClick={() => setIsMenuOpen(true)}
        type="button"
        aria-label="rozbalit menu"
      >
        {Button ? <Button {...props} /> : <DotsHorizontalIcon tw="flex w-5 h-6 opacity-50" />}
      </button>

      <div
        css={[
          tw`absolute right-0 z-10 invisible text-sm text-gray-500 bg-white border border-gray-200 rounded shadow top-full`,
          isMenuOpen && tw`visible`,
        ]}
      >
        <div tw=" h-5 w-5 absolute bottom-full right-2 overflow-hidden after:(absolute h-2.5 w-2.5 rotate-45 bg-white border border-gray-200 left-1/2 top-1/2 translate-y-1/2 translate-x--1/2)" />
        {children}
      </div>
    </div>
  )
}
