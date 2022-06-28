import { css } from "@emotion/react"
import tw from "twin.macro"

import type { StyleScopeObject } from "../common/Input"

type Props = {
  name: string
  label: string
  options: Record<string, any>
  error?: Record<string, { message: string }>
  register: React.LegacyRef<HTMLInputElement> | undefined
  ChevronComponent?: React.ElementType
  styles?: StyleScopeObject
  overrides?: StyleScopeObject
} & JSX.IntrinsicElements["input"]

const ButtonStyledRadio = ({
  name,
  options,
  label,
  register,
  styles = {},
  overrides = {},
  ...props
}: Props) => {
  const renderRadioButtons = (key: string, index: number, self: Record<string, any>) => {
    return (
      <span key={key} tw="relative">
        <input
          type="radio"
          id={`${name}-${index}`}
          name={name}
          value={String(options[key])}
          ref={register}
          tw="absolute w-0"
        />
        <label
          htmlFor={`${name}-${index}`}
          css={css`
            ${tw`inline-block px-4 py-2 border border-l-0 border-gray-400 border-solid`}
            ${index === 0 && tw`border-l rounded-l-lg`}
            ${index === self.length - 1 && tw`rounded-r-lg`}
          `}
        >
          {key}
        </label>
      </span>
    )
  }

  if (name && options) {
    return (
      <div className="fieldWrapper" css={[styles.fieldWrapper]}>
        <div className="labelWrapper" css={[styles.labelWrapper]}>
          <label htmlFor={name} css={[styles.label]}>
            {label}
          </label>
        </div>
        <div
          className="inputWrapper"
          css={css`
            ${styles.inputWrapper}
            & label {
              transition: all 0.2s ease-in-out;
            }
            & input[value="null"] {
              &:checked + label {
                ${tw`text-gray-700 bg-gray-200 border-transparent`}
                box-shadow: 0 0 0 1px rgba(74, 85, 104, 0.7);
              }
              &:focus + label {
                box-shadow: 0 0 0 1px rgba(74, 85, 104, 0.7), 0 0 2px 2px rgba(74, 85, 104, 0.4);
              }
            }
            & input[value="0"] {
              &:checked + label {
                ${tw`text-orange-700 bg-orange-200 border-transparent`}
                box-shadow: 0 0 0 1px rgba(192, 86, 33, 0.7);
              }
              &:focus + label {
                box-shadow: 0 0 0 1px rgba(192, 86, 33, 0.7), 0 0 2px 2px rgba(192, 86, 33, 0.4);
              }
            }
            & input[value="1"] {
              &:checked + label {
                ${tw`text-green-700 bg-green-200 border-transparent`}
                box-shadow: 0 0 0 1px rgba(47, 133, 90, 0.7);
              }
              &:focus + label {
                box-shadow: 0 0 0 1px rgba(47, 133, 90, 0.7), 0 0 2px 2px rgba(47, 133, 90, 0.4);
              }
            }
          `}
          {...props}
        >
          {options && Object.keys(options).map(renderRadioButtons)}
        </div>
      </div>
    )
  }
  return null
}

export default ButtonStyledRadio
