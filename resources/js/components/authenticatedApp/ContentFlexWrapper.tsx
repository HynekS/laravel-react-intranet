type Props = {
  children: React.ReactNode
}

const ContentFlexWrapper = ({ children }: Props) => (
  <div tw="flex flex-col flex-auto overflow-y-auto">{children}</div>
)

export default ContentFlexWrapper
