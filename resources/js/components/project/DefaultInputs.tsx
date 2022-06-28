import tw from "twin.macro"

import Input from "../common/Input"

import type { StyleScopeObject, InputProps } from "../common/Input"

export const styles = {
  fieldWrapper: tw`flex text-sm mb-2 flex-col md:(flex-row)`,
  labelWrapper: tw`pr-4 md:(w-60 flex items-center justify-end) lg:(w-72) xl:(w-80)`,
  label: tw`font-semibold`,
  inputWrapper: tw`w-full`,
  input: tw`border border-gray-200 text-gray-500 rounded-sm py-0.5 px-1.5 width[24ch] focus:(border-transparent outline-none ring-2 transition-shadow duration-300)`,
}

export const mergeStyles = (styles: StyleScopeObject = {}, overrides: StyleScopeObject = {}) => {
  let result = { ...styles }
  ;(Object.keys(result) as Array<keyof StyleScopeObject>).forEach(key => {
    result[key] = overrides[key] ? [result[key]].concat(overrides[key]).flat() : result[key]
  })
  return result
}

export const DefaultInput = ({ overrides, ...props }: InputProps) => (
  <Input {...props} styles={mergeStyles(styles, overrides)} />
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
