import React from "react"
import tw from "twin.macro"

const StyledLabel = tw.label`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4`
const RowWrapper = tw.div`md:flex md:items-center mb-2`
const LabelWrapper = tw.div`md:w-1/3`
const InputWrapper = tw.div`md:w-2/3`

const Checkbox = ({ name, label, register }) => {
  return (
    <RowWrapper>
      <LabelWrapper>
        <StyledLabel htmlFor={name}>{label}</StyledLabel>
      </LabelWrapper>
      <InputWrapper>
        <input type="checkbox" id={name} name={name} ref={register} />
      </InputWrapper>
    </RowWrapper>
  )
}

export default Checkbox
