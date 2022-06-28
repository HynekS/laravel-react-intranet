import { ExclamationCircleIcon } from "@heroicons/react/solid"

import type { StyleScopeObject } from "./Input"

export type TextAreaProps = {
  name: string
  label: string
  // Hotfix! Possibly faullty. Try to pluck the type from useForm
  register: React.RefObject<HTMLTextAreaElement> | React.LegacyRef<HTMLTextAreaElement>
  error?: {
    [name: string]: Error
  }
  placeholder?: string
  styles?: StyleScopeObject
  overrides?: StyleScopeObject
} & JSX.IntrinsicElements["textarea"]

const TextArea = ({
  name,
  label,
  register,
  error = {},
  placeholder = "",
  styles = {},
  overrides = {},
  ...props
}: TextAreaProps) => {
  return (
    <div className="fieldWrapper" css={[styles.fieldWrapper]}>
      <div className="labelWrapper" css={[styles.labelWrapper]}>
        <label htmlFor={name} css={[styles.label]}>
          {label}
        </label>
      </div>
      <div className="inputWrapper" css={[styles.inputWrapper]}>
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          ref={register}
          css={[styles.input]}
          className={error[name] ? "hasError" : ""}
          {...props}
        />
        {error[name] && (
          <div className="errorMessage" css={[styles.errorMessage]}>
            <ExclamationCircleIcon />
            {error[name].message}
          </div>
        )}
      </div>
    </div>
  )
}

export default TextArea
