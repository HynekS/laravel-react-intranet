import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Table as FluidTable } from "react-fluid-table"
import { Link } from "react-router-dom"
import styled from "@emotion/styled"
import tw from "twin.macro"
import { CSSTransition } from "react-transition-group"
import orderBy from "lodash.orderby"

import budgetCellRenderer from "./BudgetCellRenderer"

const transitionName = `example`
const appearDuration = 400

const StyledFluidTableWrapper = styled.div`
  ${tw`px-2 py-1`}
  &.${transitionName}-appear {
    opacity: 0;
}

&.${transitionName}-appear-active {
    opacity: 1;
    transition: opacity ${appearDuration}ms ease-out;
}
`

const StyledFluidTable = styled(FluidTable)`
  &.react-fluid-table {
    ${tw`bg-gray-100 text-sm break-words`};
  }
  & .react-fluid-table-header {
    ${tw`bg-white shadow-md`};
  }
  & .row-container {
    ${tw`transition-colors duration-300`}
    &:hover {
      ${tw`bg-gray-200`};
    }
  }
  & .cell {
    overflow-wrap: anywhere;
  }
  & .header-cell-text {
    font-family: inherit;
    &.align-right {
      width: 100%;
      text-align: right;
    }
  }
`
const Table = ({ rawData }) => {
  const [data, setData] = useState([])
  const { year } = useParams() || {}

  useEffect(() => {
    setData(rawData)
  }, [rawData])

  const onSort = (col, dir) => {
    setData(!col || !dir ? rawData : orderBy(data, [col], [dir.toLowerCase()]))
  }

  const columns = [
    {
      header: ({ onClick }) => (
        <div className="header-cell">
          <span onClick={onClick}>Číslo</span>
          <input onChange={e => console.log(e.target.value)} />
        </div>
      ),
      key: "c_akce",
      width: 80,
      sortable: true,
      cell: ({ row }) => (
        <div>
          <div>{row.c_akce}</div>
          <Link
            to={`/akce/${year}/${row.c_akce.split("/")[0]}`}
            state={row}
            aria-label={`detail akce č. ${year}/${row.c_akce.split("/")[0]}`}
          >
            Edit
          </Link>
        </div>
      ),
    },
    {
      header: "Název",
      key: "nazev_akce",
      width: 240,
      sortable: true,
    },
    {
      header: "Stav",
      key: "id_stav",
      width: 60,
      sortable: true,
    },
    {
      header: () => <div className="header-cell">Dohledy</div>,
      key: "rozpocet_B",
      width: 100,
      cell: ({ row }) => budgetCellRenderer({ row, key: "rozpocet_B" }),
    },
    {
      header: () => <div className="header-cell">Výzkum</div>,
      key: "rozpocet_A",
      width: 100,
      cell: ({ row }) => budgetCellRenderer({ row, key: "rozpocet_A" }),
    },
  ]

  return (
    <div>
      {!!data.length && (
        <CSSTransition
          in={Boolean(data.length)}
          classNames={transitionName}
          timeout={appearDuration}
          appear={true}
        >
          <StyledFluidTableWrapper
            style={{
              height: (() =>
                window.innerHeight - (document.getElementById("header").offsetHeight || 57))(),
            }}
          >
            <StyledFluidTable
              data={data}
              columns={columns}
              rowHeight={90}
              onSort={onSort}
              sortDirection="ASC"
            />
          </StyledFluidTableWrapper>
        </CSSTransition>
      )}
    </div>
  )
}

export default Table
