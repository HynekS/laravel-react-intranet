import React from "react"
import tw from "twin.macro"

const StyledInput = tw.input`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500`
const StyledLabel = tw.label`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4`
const RowWrapper = tw.div`md:flex md:items-center mb-2`
const LabelWrapper = tw.div`md:w-1/3`
const InputWrapper = tw.div`md:w-2/3`

const Input = ({ name, label, placeholder, id, register, type = "text", ...props }) => {
  return (
    <RowWrapper>
      <LabelWrapper>
        <StyledLabel htmlFor={name}>{label}</StyledLabel>
      </LabelWrapper>
      <InputWrapper>
        <StyledInput
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          ref={register}
          {...props}
        />
      </InputWrapper>
    </RowWrapper>
  )
}

export default Input
