type Props = {
  children: React.ReactNode
}

const Main = ({ children }: Props) => {
  return <main tw="flex flex-auto bg-gray-400 shadow-inner">{children}</main>
}

export default Main
