type Props = {
  children: React.ReactNode
}

const DetailPage = ({ children }: Props) => (
  <div tw="w-full py-2 px-2 shadow-inner lg:(px-10)">{children}</div>
)

export default DetailPage
