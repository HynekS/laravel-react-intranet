import { TwStyle } from "twin.macro"

import { ExclamationCircleIcon } from "@heroicons/react/solid"

export type StyleScope =
  | "fieldWrapper"
  | "labelWrapper"
  | "label"
  | "inputWrapper"
  | "input"
  | "inputError"
  | "errorMessage"

export type StyleScopeObject = { [key in StyleScope]?: TwStyle | (TwStyle | undefined)[] }

export type InputProps = {
  name: string
  label: string
  register: React.RefObject<HTMLInputElement> | React.LegacyRef<HTMLInputElement>
  error?: {
    [name: string]: Error
  }
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  styles?: StyleScopeObject
  overrides?: StyleScopeObject
} & JSX.IntrinsicElements["input"]

const Input = ({
  name,
  label,
  register,
  error = {},
  placeholder = "",
  type = "text",
  styles = {},
  overrides = {},
  ...props
}: InputProps) => {
  return (
    <div className="fieldWrapper" css={[styles.fieldWrapper]}>
      <div className="labelWrapper" css={[styles.labelWrapper]}>
        <label htmlFor={name} css={[styles.label]}>
          {label}
        </label>
      </div>
      <div className="inputWrapper" css={[styles.inputWrapper]}>
        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          ref={register}
          css={[styles.input, error[name] && styles.inputError]}
          className={error[name] ? "hasError" : ""}
          onFocus={() => {
            delete error[name]
          }}
          {...(type === "chcekbox" && { defaultChecked: !!name })}
          {...props}
        />
        {error[name] ? (
          <div className="errorMessage" css={[styles.errorMessage]}>
            <ExclamationCircleIcon tw="inline-block w-4 h-4 mr-2 fill-current" />
            {error[name].message || "Something is wrong with this field"}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Input
