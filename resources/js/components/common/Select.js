/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import SvgChevronDown from "../../vendor/heroicons/solid/ChevronDown"

const DefaultChevron = ({...props}) => (
  <SvgChevronDown tw="fill-current h-full w-4 mr-2 absolute inset-y-0 right-0 flex items-center" />
)

const Select = ({
  name,
  label,
  options,
  register,
  ChevronComponent = DefaultChevron,
  ...props
}) => {
  if (options) {
    return (
      <div className="fieldWrapper">
        {label && (
          <div className="labelWrapper">
            <label htmlFor={name}>{label}</label>
          </div>
        )}
        <div className="inputWrapper">
          <select id={name} name={name} ref={register}>
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
        </div>
      </div>
    )
  }
  return console.error("Options are required. Nothing is rendered") || null
}

export default Select
