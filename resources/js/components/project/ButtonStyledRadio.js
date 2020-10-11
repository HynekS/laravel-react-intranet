/** @jsx jsx */
import React from "react"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"

const DefaultRootWrapper = ({ children }) => <div>{children}</div>
const DefaultLabelWrapper = ({ children }) => <div>{children}</div>
const DefaultInputWrapper = ({ children }) => <div>{children}</div>

const ButtonStyledRadio = ({
  name,
  options,
  label,
  register,
  RootWrapperComponent = DefaultRootWrapper,
  LabelWrapperComponent = DefaultLabelWrapper,
  InputWrapperComponent = DefaultInputWrapper,
  LabelComponent = "label",
  ...props
}) => {
  const renderRadioButtons = (key, index, { length } = list) => {
    return (
      <span key={key} tw="relative">
        <input
          type="radio"
          id={`${name}-${index}`}
          name={name}
          value={String(options[key])}
          ref={register}
          tw="absolute w-0"
        />
        <label
          htmlFor={`${name}-${index}`}
          css={css`
            ${tw`inline-block px-4 py-2 border border-l-0 border-solid border-gray-400`}
            ${index === 0 && tw`border-l rounded-l-lg`}
            ${index === length - 1 && tw`rounded-r-lg`}
          `}
        >
          {key}
        </label>
      </span>
    )
  }

  if (name && options) {
    return (
      <div className="fieldWrapper">
        <div className="labelWrapper">
          <label htmlFor={name}>{label}</label>
        </div>
        <div
          className="inputWrapper"
          css={css`
            ${tw`text-gray-500`}
            & label {
              transition: all 0.2s ease-in-out;
            }
            & input[value="null"] {
              &:checked + label {
                ${tw`text-gray-700 bg-gray-200 border-transparent`}
                box-shadow: 0 0 0 1px rgba(74, 85, 104, 0.7);
              }
              &:focus + label {
                box-shadow: 0 0 0 1px rgba(74, 85, 104, 0.7), 0 0 2px 2px rgba(74, 85, 104, 0.4);
              }
            }
            & input[value="0"] {
              &:checked + label {
                ${tw`text-orange-700 bg-orange-200 border-transparent`}
                box-shadow: 0 0 0 1px rgba(192, 86, 33, 0.7);
              }
              &:focus + label {
                box-shadow: 0 0 0 1px rgba(192, 86, 33, 0.7), 0 0 2px 2px rgba(192, 86, 33, 0.4);
              }
            }
            & input[value="1"] {
              &:checked + label {
                ${tw`text-green-700 bg-green-200 border-transparent`}
                box-shadow: 0 0 0 1px rgba(47, 133, 90, 0.7);
              }
              &:focus + label {
                box-shadow: 0 0 0 1px rgba(47, 133, 90, 0.7), 0 0 2px 2px rgba(47, 133, 90, 0.4);
              }
            }
          `}
          {...props}
        >
          {options && Object.keys(options).map(renderRadioButtons)}
        </div>
      </div>
    )
  }
  return console.warn('"name" and "options" props are required') || null
}

export default ButtonStyledRadio
