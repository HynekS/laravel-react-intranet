import React from "react"
import { jsx } from "@emotion/react"
import tw from "twin.macro"

import SvgChevronDown from "../../vendor/heroicons/solid/ChevronDown"
import SvgExclamationCircle from "../../vendor/heroicons/solid/ExclamationCircle"

const DefaultChevron = ({ ...props }) => (
  <SvgChevronDown
    tw="absolute inset-y-0 right-0 flex items-center w-4 h-full mr-2 fill-current"
    {...props}
  />
)

const Select = ({
  name,
  label,
  options,
  register,
  error = {},
  ChevronComponent = DefaultChevron,
  ...props
}) => {
  if (!options) {
    console.error("Options are required. Nothing is rendered")
    return null
  }
  return (
    <div className="fieldWrapper">
      {label && (
        <div className="labelWrapper">
          <label htmlFor={name}>{label}</label>
        </div>
      )}
      <div className="inputWrapper">
        <select id={name} name={name} ref={register} className={error[name] ? "hasError" : ""}>
          {label && <option value="" />}
          {options.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div>
          <ChevronComponent {...props} />
        </div>
        {error[name] && (
          <div className="errorMessage">
            <SvgExclamationCircle />
            {error[name].message}
          </div>
        )}
      </div>
    </div>
  )
}

export default Select