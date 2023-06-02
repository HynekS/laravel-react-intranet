import tw from "twin.macro"

const ResultBadge = ({ value }: { value: null | number }) => {
  const strVal = String(value)
  return (
    <span tw="flex items-center h-full mt-auto min-w-[4.8rem] relative top-px">
      <span
        css={[
          tw`text-xs leading-none flex items-center border rounded-full px-1.5 pt-[0.05rem] pb-0.5 border-transparent`,
          strVal === "0" && tw`text-red-700 bg-red-50 box-shadow[0 0 0 1px rgba(185, 28, 28, 0.4)]`,
          strVal === "1" &&
            tw`text-green-700 bg-green-50 box-shadow[0 0 0 1px rgba(47, 133, 90, 0.4)]`,
          strVal === "2" &&
            tw`text-gray-700 bg-gray-200 bg-opacity-25 box-shadow[0 0 0 1px rgba(74, 85, 104, 0.45)]`,
        ]}
      >
        {strVal === "0" && "negativní"}
        {strVal === "1" && "pozitivní"}
        {strVal === "2" && "nezjištěno"}
      </span>
    </span>
  )
}

export default ResultBadge
