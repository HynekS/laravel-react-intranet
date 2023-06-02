type Props = {
  children: React.ReactNode
}

const DetailWrapper = ({ children }: Props) => (
  <div tw="bg-white border relative pt-6 pb-10 px-4 rounded-md rounded-tl-none w-full lg:(px-8) box-shadow[0 10px 15px rgba(0,0,0,0.05), 0 0 6px rgba(0,0,0,0.04)]">
    {children}
  </div>
)

export default DetailWrapper
