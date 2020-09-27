/** @jsx jsx */
import React from "react"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"

const StyledLabel = tw.label`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4`
const RowWrapper = tw.div`md:flex md:items-center mb-2`
const LabelWrapper = tw.div`md:w-1/3`
const InputWrapper = tw.div`md:w-2/3`

const Radio = ({ name, options, label, register }) => {
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
      <RowWrapper>
        <LabelWrapper>
          <StyledLabel>{label}</StyledLabel>
        </LabelWrapper>
        <InputWrapper
          css={css`
            ${tw`text-gray-500`}
            & input[value="null"]:checked + label {
              ${tw`text-gray-700 bg-gray-200 border-transparent`}
              box-shadow: 0 0 0 1px rgba(74, 85, 104, 0.7);
            }
            & input[value="0"]:checked + label {
              ${tw`text-orange-700 bg-orange-200 border-transparent`}
              box-shadow: 0 0 0 1px rgba(192, 86, 33, 0.7);
            }
            & input[value="1"]:checked + label {
              ${tw`text-green-700 bg-green-200 border-transparent`}
              box-shadow: 0 0 0 1px rgba(47, 133, 90, 0.7);
            }
          `}
        >
          {options && Object.keys(options).map(renderRadioButtons)}
        </InputWrapper>
      </RowWrapper>
    )
  }
  return console.warn('"name" and "options" props are required') || null
}

export default Radio
