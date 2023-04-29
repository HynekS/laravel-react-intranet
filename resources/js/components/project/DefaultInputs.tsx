import { forwardRef } from "react"
import tw from "twin.macro"

import Input from "../common/Input"

import type { StyleScopeObject, InputProps } from "../common/Input"

export const styles = {
  fieldWrapper: tw`flex text-sm mb-1.5 flex-col md:(flex-row)`,
  labelWrapper: tw`pr-4 md:(w-60 flex items-center justify-end) lg:(w-72) xl:(w-80)`,
  label: tw`font-semibold`,
  inputWrapper: tw`relative flex-1 w-full`,
  input: tw`border border-gray-200 text-gray-600 rounded-sm py-0.75 px-2 width[20ch] focus:(border-transparent outline-none ring-2 transition-shadow duration-300) placeholder:(text-gray-300)`,
  inputError: tw`border-red-400 focus:(ring-red-400)`,
  errorMessage: tw`absolute left-0 z-10 inline-block p-1 pr-2 text-xs text-red-400 bg-white border-red-300 rounded shadow-sm top-full`,
}

export const mergeStyles = (styles: StyleScopeObject = {}, overrides: StyleScopeObject = {}) => {
  let result = { ...styles }
  ;(Object.keys(result) as Array<keyof StyleScopeObject>).forEach(key => {
    result[key] = overrides[key] ? [result[key]].concat(overrides[key]).flat() : result[key]
  })
  return result
}

export const DefaultInput = forwardRef<HTMLInputElement, InputProps>(
  ({ overrides, ...props }, ref) => (
    <Input ref={ref} {...props} styles={mergeStyles(styles, overrides)} />
  ),
)

export const DefaultFieldset = ({
  children,
  ...props
}: {
  children: React.ReactNode
  props?: any
}) => (
  <fieldset tw="pb-5" {...props}>
    {children}
  </fieldset>
)
