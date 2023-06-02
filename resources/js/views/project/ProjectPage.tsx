type Props = {
  children: React.ReactNode
}

const DetailPage = ({ children }: Props) => (
  <div tw="w-full pt-2 pb-8 px-2 bg-gray-100 bg-opacity-75 lg:(px-10)">{children}</div>
)

export default DetailPage
