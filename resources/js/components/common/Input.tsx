import SvgExclamationCircle from "../../vendor/heroicons/solid/ExclamationCircle"

type Props = {
  name: string
  label: string
  // Hotfix! Possibly faullty. Try to pluck the type from useForm
  register: React.RefObject<HTMLInputElement> | React.LegacyRef<HTMLInputElement>
  error?: {
    [name: string]: Error
  }
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
}

const Input = ({
  name,
  label,
  register,
  error = {},
  placeholder = "",
  type = "text",
  ...props
}: Props) => {
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

export default Input
