import { forwardRef } from "react"
import { ExclamationCircleIcon } from "@heroicons/react/solid"

import type { StyleScopeObject } from "./Input"

export type TextAreaProps = {
  name: string
  label: string
  error?: {
    [name: string]: Error
  }
  placeholder?: string
  styles?: StyleScopeObject
  overrides?: StyleScopeObject
} & JSX.IntrinsicElements["textarea"]

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ name, label, error = {}, placeholder = "", styles = {}, overrides = {}, ...props }, ref) => {
    return (
      <div css={[styles.fieldWrapper]}>
        <div css={[styles.labelWrapper]}>
          <label htmlFor={name} css={[styles.label]}>
            {label}
          </label>
        </div>
        <div css={[styles.inputWrapper]}>
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            ref={ref}
            css={[styles.input]}
            {...props}
          />
          {error[name] && (
            <div css={[styles.errorMessage]}>
              <ExclamationCircleIcon />
              {error[name].message}
            </div>
          )}
        </div>
      </div>
    )
  },
)

export default TextArea
