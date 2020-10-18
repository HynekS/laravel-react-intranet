// @ts-check
/** @jsx jsx */
import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useWindowHeight } from "@react-hook/window-size"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"
import deburr from "lodash.deburr"
import Highlighter from "react-highlight-words"
import BaseTable, { Column, AutoResizer, SortOrder } from "react-base-table"
import "react-base-table/styles.css"

import { projectStatus } from "../../store/projects"
import { setSortBy, updateFilters, clearFilters } from "../../store/table"
import sortIdSlashYear from "../../services/sorting/sortIdSlashYear"
import { Detail } from "../project/lazyImports"
import budgetCellRenderer from "./BudgetCellRenderer"
import SvgCheck from "../../vendor/heroicons/outline/Check"
import SvgPencil from "../../vendor/heroicons/outline/Pencil"
import SvgXCircle from "../../vendor/heroicons/outline/XCircle"
import SvgCheckCircle from "../../vendor/heroicons/outline/CheckCircle"

const Table = ({ rawData }) => {
  const dispatch = useDispatch()
  const formRef = React.useRef()

  const [data, setData] = useState([])
  const { year } = useParams()
  const currentHeight = useWindowHeight()

  const status = useSelector(store => store.projects.status)
  const sortBy = useSelector(store => store.table.sortBy)
  const filters = useSelector(store => store.table.filters)

  useEffect(() => {
    setData(applyFilters(sortData(rawData, { ...sortBy })))
  }, [rawData, filters])

  /*
    filtering
  */
  const filterData = ({ dataKey }, e) => {
    const { value } = e.target
    dispatch(updateFilters({ ...filters, [dataKey]: value }))

    const wasDeletion = filters[dataKey] && filters[dataKey].length > value.length
    const filteredData = wasDeletion ? applyFilters(rawData) : applyFilters(data)

    setData(filteredData)
  }

  const applyFilters = inputData => {
    let result = inputData.slice(0)

    for (let [column, query] of Object.entries(filters)) {
      const stringToFind = new RegExp(deburr(query), "i")
      result = result.filter(row => stringToFind.test(deburr(String(row[column]))))
    }
    return result
  }

  /*
    sorting
  */
  const sortData = (data, { key, order }) => {
    const defaultSort = (a, b) => {
      let sortCache = a[key] - b[key]
      return isNaN(sortCache) ? String(a[key]).localeCompare(b[key]) : sortCache
    }

    const sortedList =
      key === "c_akce" ? sortIdSlashYear(data.slice(0), key) : data.slice(0).sort(defaultSort)

    if (order === SortOrder.DESC) {
      sortedList.reverse()
    }
    return sortedList
  }

  const onColumnSort = ({ key, order }) => {
    dispatch(setSortBy({ key, order }))
    setData(applyFilters(sortData(data, { key, order })))
  }

  const columns = [
    {
      title: "Číslo",
      key: "c_akce",
      dataKey: "c_akce",
      width: 80,
      cellRenderer: ({ cellData: c_akce, rowData }) => (
        <div onMouseOver={() => Detail.preload()}>
          <div key="numberPerYear">
            <strong>{c_akce}</strong>
          </div>
          <Link
            key="linkToDetail"
            to={`/akce/${year}/${c_akce.split("/")[0]}`}
            state={rowData}
            aria-label={`odkaz na detail akce č. ${year}/${c_akce.split("/")[0]}`}
          >
            <div tw="flex items-center justify-center p-1 px-2 bg-blue-500 hover:bg-blue-700 transition-colors duration-300 text-white rounded">
              <SvgPencil tw="w-4" />
            </div>
          </Link>
        </div>
      ),
      sortable: true,
    },
    {
      title: "Název",
      key: "nazev_akce",
      dataKey: "nazev_akce",
      width: 240,
      sortable: true,
      resizable: true,
      cellRenderer: ({ cellData, column: { key } }) => (
        <Highlighter
          textToHighlight={cellData}
          sanitize={deburr}
          searchWords={[filters[key] || ""]}
          highlightStyle={{ backgroundColor: "#fbd38d" /* tailwind bg-orange-300 */}}
          style={{
            wordBreak: "break-word",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {cellData}
        </Highlighter>
      ),
      headerRenderer: ({ column }) => (
        <div>
          <div>{column.title}</div>
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
            onChange={e => filterData(column, e)}
          />
        </div>
      ),
    },
    {
      title: "Dohledy",
      key: "rozpocet_B",
      dataKey: "rozpocet_B",
      width: 100,
      align: Column.Alignment.RIGHT,
      cellRenderer: ({ rowData }) => budgetCellRenderer({ row: rowData, key: "rozpocet_B" }),
      sortable: true,
    },
    {
      title: "Výzkum",
      key: "rozpocet_A",
      dataKey: "rozpocet_A",
      width: 100,
      align: Column.Alignment.RIGHT,
      cellRenderer: ({ rowData }) => budgetCellRenderer({ row: rowData, key: "rozpocet_A" }),
      sortable: true,
    },
    {
      title: "Reg.",
      key: "registrovano_bit",
      dataKey: "registrovano_bit",
      width: 40,
      cellRenderer: ({ cellData }) =>
        Boolean(cellData) ? <SvgCheck width={"1.25rem"} stroke="#48bb78" /> : null,
      sortable: true,
    },
    {
      title: "Číslo reg.",
      key: "registrace_info",
      dataKey: "registrace_info",
      width: 100,
      sortable: true,
    },
    {
      title: "ZAA",
      key: "zaa_hlaseno",
      dataKey: "zaa_hlaseno",
      width: 60,
      cellRenderer: ({ cellData }) =>
        Boolean(cellData) ? <SvgCheck width={"1.25rem"} stroke="#48bb78" /> : null,
    },
    {
      title: "Stav",
      key: "id_stav",
      dataKey: "id_stav",
      width: 60,
      align: Column.Alignment.RIGHT,
      sortable: true,
      headerRenderer: ({ column }) => (
        <div>
          <div>{column.title}</div>
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
            onChange={e => filterData(column, e)}
          />
        </div>
      ),
    },
    {
      title: "Investor",
      key: "investor_jmeno",
      dataKey: "investor_jmeno",
      width: 180,
      headerRenderer: ({ column }) => (
        <div>
          <div>{column.title}</div>
          <input
            tw="relative"
            type="text"
            name={column.key}
            defaultValue={filters[column.key]}
            aria-label="filtrovat"
            onClick={e => {
              e.stopPropagation()
            }}
            onChange={e => filterData(column, e)}
          />
        </div>
      ),
      cellRenderer: ({ cellData, column: { key } }) => (
        <Highlighter
          textToHighlight={cellData}
          sanitize={deburr}
          searchWords={[filters[key] || ""]}
          highlightStyle={{ backgroundColor: "#fbd38d" /* tailwind bg-orange-300 */}}
        >
          {cellData}
        </Highlighter>
      ),
    },

    {
      title: "Kontakt",
      key: "investor_kontakt",
      dataKey: "investor_kontakt",
      width: 180,
    },
    {
      title: "Kraj",
      key: "kraj",
      dataKey: "kraj",
      width: 80,
      sortable: true,
      headerRenderer: ({ column }) => (
        <div>
          <div>{column.title}</div>
          <input
            tw="relative"
            type="text"
            name={column.key}
            defaultValue={filters[column.key]}
            aria-label="filtrovat"
            onClick={e => {
              e.stopPropagation()
            }}
            onChange={e => filterData(column, e)}
          />
        </div>
      ),
      cellRenderer: ({ cellData, column: { key } }) => (
        <Highlighter
          textToHighlight={cellData}
          sanitize={deburr}
          searchWords={[filters[key] || ""]}
          highlightStyle={{ backgroundColor: "#fbd38d" /* tailwind bg-orange-300 */}}
        >
          {cellData}
        </Highlighter>
      ),
    },
    {
      title: "Katastr",
      key: "katastr",
      dataKey: "katastr",
      width: 80,
      sortable: true,
    },
    {
      title: "Zahájeno",
      key: "datum_pocatku",
      dataKey: "datum_pocatku",
      width: 100,
      cellRenderer: ({ rowData }) =>
        rowData.datum_pocatku ? rowData.datum_pocatku : rowData.datum_pocatku_text,
    },
    {
      title: "Ukončeno",
      key: "datum_ukonceni",
      dataKey: "datum_ukonceni",
      width: 100,
      cellRenderer: ({ rowData }) =>
        rowData.datum_ukonceni ? rowData.datum_pocatku : rowData.datum_ukonceni_text,
    },
    {
      title: "Zajišťuje",
      key: "user",
      dataKey: "user.full_name",
      width: 90,
      sortable: true,
    },
    {
      title: "Nález",
      key: "nalez",
      dataKey: "nalez",
      width: 80,
      sortable: true,
      cellRenderer: ({ cellData }) => {
        if (cellData === "1") {
          return <SvgCheckCircle tw="w-5 stroke-green-400 fill-green-100" />
        }
        if (cellData === "0") {
          return <SvgXCircle tw="w-5 stroke-red-400 fill-red-100" />
        }
        return null
      },
    },
  ]

  return (
    <div
      style={{
        width: "100%",
        height: currentHeight - (document.getElementById("header").offsetHeight || 0),
      }}
    >
      <AutoResizer>
        {({ width, height }) => (
          <BaseTable
            css={css`
              .BaseTable__row.negative {
                ${tw`bg-red-100 text-red-900`}
                &:hover {
                  ${tw`bg-red-200 bg-opacity-50`}
                }
              }
              .BaseTable__row.positive {
                ${tw`bg-green-100 text-green-900`}
                &:hover {
                  ${tw`bg-green-200 bg-opacity-50`}
                }
              }
              .BaseTable__row {
                border-bottom: none;
              }
            `}
            data={data}
            rowHeight={90}
            headerHeight={[60, Object.values(filters).filter(Boolean).length ? 30 : 0]}
            width={width}
            height={height}
            sortBy={sortBy}
            onColumnSort={onColumnSort}
            rowClassName={({ rowData }) => {
              if (rowData.nalez === "1") {
                return "positive"
              }
              if (rowData.nalez === "0") {
                return "negative"
              }
            }}
            rowKey="id_akce"
            emptyRenderer={() => {
              console.log(status)
              switch (status) {
                case projectStatus.LOADING:
                  return <div tw="flex items-center justify-center h-full">Načítám data…</div>
                case projectStatus.SUCCESS:
                  return (
                    <div tw="flex items-center justify-center h-full">
                      Zadaným parametrům neodpovídá žádná akce 🤔.
                    </div>
                  )
                case projectStatus.ERROR:
                  return <div>Ajaj! Někde se stala chyba… 😬</div>
                default:
                  return null
              }
            }}
            headerRenderer={({ cells, headerIndex }) =>
              headerIndex === 0 ? (
                <form tw="flex h-full" key="primaryHeader" ref={formRef}>
                  {cells.map(cell => (
                    <div>{cell}</div>
                  ))}
                </form>
              ) : (
                <div role="cell" key="secondaryHeader">
                  Nalezeno {data && data.length} akcí.
                  <button
                    onClick={() => {
                      dispatch(clearFilters())
                      if (formRef && formRef.current) {
                        formRef.current.reset()
                      }
                    }}
                  >
                    Zrušit všechny filtry
                  </button>
                </div>
              )
            }
          >
            {columns.map(column => (
              <Column data={data} rawData={rawData} {...column} />
            ))}
          </BaseTable>
        )}
      </AutoResizer>
    </div>
  )
}

export default Table
