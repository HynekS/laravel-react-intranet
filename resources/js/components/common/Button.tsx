import tw from "twin.macro"

type Props = {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  type?: "button" | "submit" | "reset"
  className?: string
} & React.HTMLProps<HTMLButtonElement> //& JSX.IntrinsicElements["button"]

// https://github.com/ben-rogerson/twin.macro/discussions/510#discussioncomment-1203460
const Button = ({ type = "button", onClick, className, children, ...props }: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      css={tw`flex items-center bg-blue-600 transition-colors duration-300 text-white font-medium py-2 px-4 rounded hover:(bg-blue-700) focus:(outline-none ring)`}
      {...{ className }}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
