import React from "react"

const DefaultRootWrapper = ({ children }) => <div>{children}</div>;
const DefaultLabelWrapper = ({ children }) => <div>{children}</div>
const DefaultInputWrapper = ({ children }) => <div>{children}</div>

const Input = ({
  name,
  label,
  placeholder,
  register,
  type = "text",
  RootWrapperComponent = DefaultRootWrapper,
  LabelWrapperComponent = DefaultLabelWrapper,
  InputWrapperComponent = DefaultInputWrapper,
  LabelComponent = "label",
  InputComponent = "input",
  ...props
}) => {
  return (
    <RootWrapperComponent {...props}>
      <LabelWrapperComponent {...props}>
        <LabelComponent htmlFor={name} {...props}>{label}</LabelComponent>
      </LabelWrapperComponent>
      <InputWrapperComponent {...props}>
        <InputComponent
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          ref={register}
          {...props}
        />
      </InputWrapperComponent>
    </RootWrapperComponent>
  );
};

export default Input;