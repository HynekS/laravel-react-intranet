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
      <span key={key}>
        <input
          type="radio"
          id={`${name}-${index}`}
          name={name}
          value={String(options[key])}
          ref={register}
          css={css`
            display: none;
            &:checked ~ label {
              ${tw`bg-green-200`}
            }
          `}
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
        <InputWrapper>{options && Object.keys(options).map(renderRadioButtons)}</InputWrapper>
      </RowWrapper>
    )
  }
  return console.warn('"name" and "options" props are required') || null
}

export default Radio
