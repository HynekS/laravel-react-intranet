/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"
/*
const StyledLabel = tw.label`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4`
const StyledSelect = tw.select`block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 p-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline`
const RowWrapper = tw.div`md:flex md:items-center mb-2`
const LabelWrapper = tw.div`md:w-1/3`
const InputWrapper = tw.div`md:w-2/3 inline-block relative max-w-sm`
const ChevronWrapper = tw.div`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700`
const Chevron = tw.svg`fill-current h-4 w-4`
*/
const DefaultRootWrapper = ({ children }) => <div>{children}</div>
const DefaultLabelWrapper = ({ children }) => <div>{children}</div>
const DefaultInputWrapper = ({ children }) => <div tw="relative">{children}</div>
const DefaultChevronWrapper = ({ children }) => (
  <div tw="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    {children}
  </div>
)
const DefaultChevron = ({ children }) => (
  <svg tw="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
    {children}
  </svg>
)

const Select = ({
  name,
  label,
  options,
  register,
  RootWrapperComponent = DefaultRootWrapper,
  LabelWrapperComponent = DefaultLabelWrapper,
  InputWrapperComponent = DefaultInputWrapper,
  ChevronWrapperComponent = DefaultChevronWrapper,
  ChevronComponent = DefaultChevron,
  LabelComponent = "label",
  InputComponent = "select",
  ...props
}) => {
  if (options) {
    return (
      <RootWrapperComponent {...props}>
        {label && (
          <LabelWrapperComponent {...props}>
            <LabelComponent htmlFor={name} {...props}>
              {label}
            </LabelComponent>
          </LabelWrapperComponent>
        )}
        <InputWrapperComponent {...props}>
          <InputComponent id={name} name={name} ref={register} {...props}>
            {label && <option value="" />}
            {options.map((option, i) => (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            ))}
          </InputComponent>
          <ChevronWrapperComponent {...props}>
            <ChevronComponent {...props} />
          </ChevronWrapperComponent>
        </InputWrapperComponent>
      </RootWrapperComponent>
    )
  }
  return <div/>
}

export default Select
