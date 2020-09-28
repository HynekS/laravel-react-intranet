import React from "react"

const DefaultRootWrapper = ({ children }) => <div>{children}</div>
const DefaultLabelWrapper = ({ children }) => <div>{children}</div>
const DefaultInputWrapper = ({ children }) => <div>{children}</div>

const Checkbox = ({
  name,
  label,
  register,
  RootWrapperComponent = DefaultRootWrapper,
  LabelWrapperComponent = DefaultLabelWrapper,
  InputWrapperComponent = DefaultInputWrapper,
  LabelComponent = "label",
  InputComponents = "input",
  ...props
}) => {
  return (
    <RootWrapperComponent {...props}>
      <LabelWrapperComponent {...props}>
        <LabelComponent htmlFor={name} {...props}>{label}</LabelComponent>
      </LabelWrapperComponent>
      <InputWrapperComponent {...props}>
        <InputComponents type="checkbox" id={name} name={name} ref={register} {...props}/>
      </InputWrapperComponent>
    </RootWrapperComponent>
  )
}

export default Checkbox
