/** @jsx jsx */
import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import BaseTable, { Column, AutoResizer, SortOrder } from "react-base-table"
import "react-base-table/styles.css"
import { Link } from "react-router-dom"
import { jsx } from "@emotion/core"
import tw, { css } from "twin.macro"

import budgetCellRenderer from "./BudgetCellRenderer"
import SvgCheck from "../../vendor/heroicons/outline/Check"
import SvgPencil from "../../vendor/heroicons/outline/Pencil"
import SvgXCircle from "../../vendor/heroicons/outline/XCircle"
import SvgCheckCircle from "../../vendor/heroicons/outline/CheckCircle"

const Table = ({ rawData }) => {
  const [data, setData] = useState([])
  const { year } = useParams() || {}

  const [sortBy, setSortBy] = useState({ key: "c_akce", order: SortOrder.ASC })

  useEffect(() => {
    setData(rawData)
  }, [rawData])

  const onColumnSort = ({ column, key, order }) => {
    const dataToSort = data
    // Sort non-numeric values usin local compare. Warning: TODO need to take care 'undefined'
    const sortedList = [...dataToSort].sort((a, b) => {
      let sortCache = a[key] - b[key]
      return isNaN(sortCache) ? String(a[key]).localeCompare(b[key]) : sortCache
    })
    if (order === "desc") {
      sortedList.reverse()
    }
    setSortBy({ column, key, order })
    setData(sortedList)
  }

  const columns = [
    {
      title: "Číslo",
      key: "c_akce",
      dataKey: "c_akce",
      width: 80,
      cellRenderer: ({ cellData: c_akce, rowData }) => (
        <div>
          <div>
            <strong>{c_akce}</strong>
          </div>
          <Link to={`/akce/${year}/${c_akce.split("/")[0]}`} state={rowData}>
            <div tw="flex items-center justify-center p-1 px-2 bg-blue-500 hover:bg-blue-700 transition-colors duration-300 text-white rounded">
              <SvgPencil width="1rem" />
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
    },
    {
      title: "Investor",
      key: "investor_jmeno",
      dataKey: "investor_jmeno",
      width: 180,
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
        height: (() =>
          window.innerHeight - (document.getElementById("header").offsetHeight || 57))(),
      }}
    >
      <AutoResizer>
        {({ width, height }) => (
          <BaseTable
            css={css`
              .BaseTable__row.negative {
                ${tw`bg-red-100`}
                &:hover {
                  ${tw`bg-red-200 bg-opacity-50`}
                }
              }
              .BaseTable__row.positive {
                ${tw`bg-green-100`}
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
          >
            {columns.map(column => (
              <Column {...column} />
            ))}
          </BaseTable>
        )}
      </AutoResizer>
    </div>
  )
}

export default Table
