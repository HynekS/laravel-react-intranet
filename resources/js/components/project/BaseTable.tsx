import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { useWindowHeight } from "@react-hook/window-size"
import { css } from "@emotion/react"
import tw from "twin.macro"
import deburr from "lodash.deburr"
import Highlighter from "react-highlight-words"
import BaseTable, { Column, AutoResizer, SortOrder, BaseTableProps } from "react-base-table"
import "react-base-table/styles.css"

import { status } from "../../store/projects"
import { setSortBy, updateFilters, Filters, clearFilters } from "../../store/table"
import sortIdSlashYear from "../../services/sorting/sortIdSlashYear"
import { Detail } from "./lazyImports"
import budgetCellRenderer from "./BudgetCellRenderer"
import {
  CheckIcon,
  PencilIcon,
  XCircleIcon,
  XIcon,
  CheckCircleIcon,
} from "@heroicons/react/outline"

import type { AppState } from "../../store/rootReducer"
import type { akce as Akce } from "@/types/model"

type Props = {
  rawData: Akce[]
}

const Table = ({ rawData }: Props) => {
  const dispatch = useDispatch()
  const formRef = useRef<HTMLFormElement>(null)
  const tableRef = useRef<BaseTable<Akce>>(null)
  const scrollOffset = useRef(0)
  const keydownIntervalRef = useRef<number | null>(null)

  const [data, setData] = useState([])
  const { year } = useParams<{ year: string }>()
  const currentHeight = useWindowHeight()

  const projectStatus = useSelector((store: AppState) => store.projects.projectStatus)
  const sortBy = useSelector((store: AppState) => store.table.sortBy, shallowEqual)
  const filters: Filters = useSelector((store: AppState) => store.table.filters, shallowEqual)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (tableRef.current === undefined || scrollOffset.current === undefined) return
    if (["PageUp", "PageDown", "Home", "End"].includes(e.code)) {
      if (keydownIntervalRef.current) {
        window.clearInterval(Number(keydownIntervalRef.current))
        keydownIntervalRef.current = null
      }
      keydownIntervalRef.current = window.setInterval(() => {
        if (tableRef && tableRef.current && tableRef.current.scrollToPosition) {
          if (e.code === "PageUp") {
            scrollOffset.current = Math.max(scrollOffset.current - currentHeight, 0)
            tableRef.current.scrollToPosition({ scrollLeft: 0, scrollTop: scrollOffset.current })
          }
          if (e.code === "PageDown") {
            scrollOffset.current = Math.min(
              scrollOffset.current + currentHeight,
              // TODO must probably add header and table header height into the formula
              tableRef.current.getTotalRowsHeight() - (currentHeight - (81 + 59)),
            )
            tableRef.current.scrollToPosition({ scrollLeft: 0, scrollTop: scrollOffset.current })
          }
          if (e.code === "Home") {
            scrollOffset.current = 0
            tableRef.current.scrollToPosition({ scrollLeft: 0, scrollTop: 0 })
          }
          if (e.code === "End") {
            scrollOffset.current = tableRef.current.getTotalRowsHeight()
            // TODO must probably add header and table header height into the formula
            tableRef.current.scrollToPosition({
              scrollLeft: 0,
              scrollTop: scrollOffset.current - currentHeight + (81 + 59),
            })
          }
        }
      }, 20)
    }
  }

  const handleKeyUp = () => {
    if (keydownIntervalRef.current) {
      window.clearInterval(keydownIntervalRef.current)
      keydownIntervalRef.current = null
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    setData(applyFilters(sortData(rawData, { ...sortBy })))
  }, [rawData, filters])

  /*
    filtering
  */
  const filterData = ({ dataKey }, e: React.ChangeEvent<HTMLInputElement>) => {
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
  const sortData = (data: Akce[], { key, order }: { key: keyof Akce; order: SortOrder }) => {
    const defaultSort = (a: Akce, b: Akce) => {
      let sortCache = Number(a[key]) - Number(b[key])
      return isNaN(sortCache) ? String(a[key]).localeCompare(String(b[key])) : sortCache
    }

    const sortedList =
      key === "c_akce" ? sortIdSlashYear(data.slice(0), key) : data.slice(0).sort(defaultSort)

    if (order === "desc") {
      sortedList.reverse()
    }
    return sortedList
  }

  const onColumnSort = ({ key, order }) => {
    dispatch(setSortBy({ key, order }))
    setData(applyFilters(sortData(data, { key, order })))
  }

  const columns: BaseTableProps[] = [
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
            <div tw="flex items-center justify-center p-1 px-2 text-white transition-colors duration-300 bg-blue-500 rounded hover:bg-blue-700">
              <PencilIcon tw="w-4" />
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
          highlightStyle={{ backgroundColor: "#fbd38d" /* tailwind bg-orange-300 */ }}
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
        Boolean(cellData) ? <CheckIcon width={"1.25rem"} stroke="#48bb78" /> : null,
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
        Boolean(cellData) ? <CheckIcon width={"1.25rem"} stroke="#48bb78" /> : null,
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
          highlightStyle={{ backgroundColor: "#fbd38d" /* tailwind bg-orange-300 */ }}
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
          highlightStyle={{ backgroundColor: "#fbd38d" /* tailwind bg-orange-300 */ }}
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
          return <CheckCircleIcon tw="w-5 stroke-green-400 fill-green-100" />
        }
        if (cellData === "0") {
          return <XCircleIcon tw="w-5 stroke-red-400 fill-red-100" />
        }
        return null
      },
    },
  ]

  return (
    <div
      style={{
        width: "100%",
        height: currentHeight - (document.getElementById("header")?.offsetHeight || 0),
      }}
    >
      <AutoResizer>
        {({ width, height }) => (
          <BaseTable
            css={css`
              .BaseTable__header-cell {
                align-items: flex-start;
                padding-top: 0.5em;
              }
              .BaseTable__header-cell--align-right {
                ${tw`flex-row-reverse justify-start`}
              }
              .BaseTable__header-cell--sortable {
              }
              .BaseTable__row.negative {
                ${tw`text-red-900 bg-red-50`}
                &:hover {
                  ${tw`bg-red-100 bg-opacity-75`}
                }
              }
              .BaseTable__row.positive {
                ${tw`text-green-900 bg-green-50`}
                &:hover {
                  ${tw`bg-green-100 bg-opacity-75`}
                }
              }
              .BaseTable__row {
                border-bottom: none;
                &:hover {
                  ${tw`bg-gray-50`}
                }
              }
              .BaseTable__header {
                ${tw`shadow-lg`}
              }
              .BaseTable__header-row {
                ${tw`bg-white`}
              }
              input {
                ${tw`w-full h-5 p-1 mt-1 text-xs bg-blue-100 border border-blue-200 rounded-sm border-b-gray-200 border-r-gray-200`}
                &:focus:not(.focus-visible) {
                  ${tw`outline-none focus:(ring ring-2 border-blue-500 bg-blue-100)`}
                }
                &[value=""] {
                  ${tw`bg-gray-100 border-gray-300`}
                }
              }
            `}
            data={data}
            rowHeight={90}
            headerHeight={[60, Object.values(filters).filter(Boolean).length ? 39 : 0]}
            width={width}
            height={height}
            sortBy={sortBy as { key: React.Key; order: SortOrder }}
            onColumnSort={onColumnSort}
            rowClassName={({ rowData }: { rowData: Akce }) => {
              if (String(rowData.nalez) === "1") {
                return "positive"
              }
              if (String(rowData.nalez) === "0") {
                return "negative"
              }
              return ""
            }}
            rowKey="id_akce"
            emptyRenderer={() => {
              switch (status) {
                case "pending":
                  return <div tw="flex items-center justify-center h-full">Načítám data…</div>
                case "fulfilled":
                  return (
                    <div tw="flex items-center justify-center h-full">
                      Zadaným parametrům neodpovídá žádná akce 🤔.
                    </div>
                  )
                case "rejected":
                  return <div>Ajaj! Někde se stala chyba… 😬</div>
                default:
                  return null
              }
            }}
            headerRenderer={({ cells, headerIndex }) =>
              headerIndex === 0 ? (
                <form tw="flex h-full" key="primaryHeader" ref={formRef}>
                  {cells.map(cell => (
                    <div key={cell.key}>{cell}</div>
                  ))}
                </form>
              ) : (
                <div
                  role="cell"
                  key="secondaryHeader"
                  tw="flex items-center justify-between w-full h-full px-4 py-1 bg-blue-50"
                >
                  <span tw="text-blue-600">Nalezeno {data && data.length} akcí.</span>
                  <button
                    tw="flex items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-1 px-2 rounded text-xs focus:(outline-none ring)"
                    onClick={() => {
                      if (formRef && formRef.current) {
                        formRef.current.reset()
                      }
                      dispatch(clearFilters())
                    }}
                  >
                    <XIcon tw="w-3 mr-1" />
                    Zrušit všechny filtry
                  </button>
                </div>
              )
            }
            ref={tableRef}
          >
            {columns.map(column => (
              <Column data={data} key={column.data_key} rawData={rawData} {...column} />
            ))}
          </BaseTable>
        )}
      </AutoResizer>
    </div>
  )
}

export default Table
