import { jsx } from "@emotion/react"
import tw from "twin.macro"

const StyledLabel = tw.label`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4`
const RowWrapper = tw.div`md:flex md:items-center mb-2`
const LabelWrapper = tw.div`md:w-1/3`
const InputWrapper = tw.div`md:w-2/3`

const Radio = ({ name, options, label, register }) => {
  const renderRadioButtons = (key, index) => {
    return (
      <label key={key} htmlFor={`${name}-${index}`} tw="pr-2">
        {key}
        <input
          type="radio"
          id={`${name}-${index}`}
          name={name}
          value={String(options[key])}
          ref={register}
          tw="ml-1"
        />
      </label>
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
