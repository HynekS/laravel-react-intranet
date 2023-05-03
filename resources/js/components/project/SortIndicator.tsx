import { ChevronUpIcon } from "@heroicons/react/solid"

const SortIndicator = ({ column, sortBy }) => {
  return (
    <div tw="text-gray-500">
      {sortBy.key === column.key
        ? (sortBy.order === "desc" && <ChevronUpIcon tw="w-4 h-4 mx-0.75 rotate-180" />) ||
          (sortBy.order === "asc" && <ChevronUpIcon tw="w-4 h-4 mx-0.75" />)
        : null}
    </div>
  )
}

export default SortIndicator
