import React from "react"

const Input = ({ name, label, register, error={}, placeholder = "", type = "text", ...props }) => {
  return (
    <div className="fieldWrapper">
      <div className="labelWrapper">
        <label htmlFor={name}>{label}</label>
      </div>
      <div className="inputWrapper">
        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          ref={register}
          className={error[name] ? "hasError" : ""}
          {...props}
        />
        {error[name] && <div className="errorMessage">{error[name].message}</div>}
      </div>
    </div>
  )
}

export default Input
