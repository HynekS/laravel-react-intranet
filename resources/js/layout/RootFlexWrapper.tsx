type Props = {
  children: React.ReactNode
}

const RootFlexWrapper = ({ children }: Props) => <div tw="flex flex-col h-full">{children}</div>

export default RootFlexWrapper
