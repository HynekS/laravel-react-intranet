import { XIcon } from "@heroicons/react/outline"

type Props = {
  handleClick: React.MouseEventHandler<HTMLButtonElement>
}

const ModalCloseButton = ({ handleClick }: Props) => {
  return (
    <button onClick={handleClick}>
      <XIcon tw="w-6" />
    </button>
  )
}

export default ModalCloseButton
