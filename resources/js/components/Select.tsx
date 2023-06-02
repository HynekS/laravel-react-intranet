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
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    if (!options) {
      console.error("Options are required. Nothing is rendered")
      return null
    }
    return (
      <div css={[styles.fieldWrapper]}>
        {label && (
          <div css={[styles.labelWrapper]}>
            <label htmlFor={name} css={[styles.label]}>
              {label}
            </label>
          </div>
        )}
        <div css={[styles.inputWrapper]}>
          <div tw="relative inline-block">
            <select
              id={name}
              name={name}
              ref={ref}
              onChange={onChange}
              onBlur={onBlur}
              css={[styles.input, error[name] && styles.inputError, tw`appearance-none`]}
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
            <div css={[styles.errorMessage]}>
              <ExclamationCircleIcon tw="inline-block w-4 h-4 mr-2 fill-current" />
              {error?.[name]?.message}
            </div>
          )}
        </div>
      </div>
    )
  },
)

export default Select
