import SortIndicator from "./SortIndicator"

const HeaderWithTextInput = ({ column, sortBy, filters, filterFn }) => {
  return (
    <div>
      <div tw="flex justify-start items-center">
        <span>{column.title}</span>
        {column.sortable && <SortIndicator column={column} sortBy={sortBy} />}
      </div>
      <div tw="px-0.5 pb-0.5">
        <input
          tw="relative"
          type="text"
          name={column.key}
          autoComplete="off"
          defaultValue={filters[column.key]}
          aria-label="filtrovat"
          onClick={e => {
            e.stopPropagation()
          }}
          onChange={filterFn}
        />
      </div>
    </div>
  )
}

export default HeaderWithTextInput
