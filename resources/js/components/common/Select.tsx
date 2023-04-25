import { forwardRef } from "react"
import { ChevronDownIcon, ExclamationCircleIcon } from "@heroicons/react/solid"
import tw from "twin.macro"

import type { StyleScopeObject } from "./Input"
import type { FieldErrors, FieldValues } from "react-hook-form"

type Props = {
  name: string
  label: string
  options: any[]
  error?: FieldErrors<FieldValues>
  ChevronComponent?: React.ElementType
  styles?: StyleScopeObject
  overrides?: StyleScopeObject
} & JSX.IntrinsicElements["select"]

const DefaultChevron = (props: any) => (
  <ChevronDownIcon
    tw="absolute inset-y-0 right-0 flex items-center w-4 h-full mr-1 fill-current pointer-events-none"
    {...props}
  />
)

const Select = forwardRef<HTMLSelectElement, Props>(
  (
    {
      name,
      label,
      options,
      error = {},
      ChevronComponent = DefaultChevron,
      styles = {},
      overrides = {},
      ...props
    },
    ref,
  ) => {
    if (!options) {
      console.error("Options are required. Nothing is rendered")
      return null
    }
    return (
      <div className="fieldWrapper" css={[styles.fieldWrapper]}>
        {label && (
          <div className="labelWrapper" css={[styles.labelWrapper]}>
            <label htmlFor={name} css={[styles.label]}>
              {label}
            </label>
          </div>
        )}
        <div className="inputWrapper" css={[styles.inputWrapper]}>
          <div tw="relative inline-block">
            <select
              id={name}
              name={name}
              ref={ref}
              className={error[name] ? "hasError" : ""}
              css={[styles.input, tw`appearance-none`]}
            >
              {label && <option value="" />}
              {options.map((option, i) => (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronComponent {...props} />
          </div>
          {error[name] && (
            <div className="errorMessage">
              <ExclamationCircleIcon />
              {error?.[name]?.message}
            </div>
          )}
        </div>
      </div>
    )
  },
)

export default Select
